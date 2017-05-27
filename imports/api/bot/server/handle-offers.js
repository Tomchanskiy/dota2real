import { Meteor } from 'meteor/meteor';
import _ from 'underscore';
import Dropbox from 'dropbox';
import Chance from 'chance';

import { Bets } from '../../bets/bets';
import { Games } from '../../games/games';
import { Winners } from '../../winners/winners';
import { streamerRoulette } from '../../events/events';

import { accessToken } from '../../config-data';
import { sendItems } from './send-items';

const dbx = new Dropbox({ accessToken });
const chancejs = new Chance();

streamerRoulette.allowRead('all');
streamerRoulette.allowWrite('all');

export const handleOffers = (offers) => {
  offers.getOffers({
    get_received_offers: 1,
    active_only: 1,
    get_descriptions: 1,
    time_historical_cutoff: Math.round(Date.now() / 1000)
  }, Meteor.bindEnvironment((err, body) => {
    if (err) return console.log(err);

    if (body && body.response && body.response.trade_offers_received) {
      const tradeOffers = body.response.trade_offers_received;

      if (tradeOffers.length > 0) {
        _.each(tradeOffers, tradeOffer => {
          offers.acceptOffer({
            tradeOfferId: tradeOffer.tradeofferid,
            partnerSteamId: tradeOffer.steamid_other
          }, Meteor.bindEnvironment((err, result) => {
            if (err) return console.log(err);

            // Проверка пользователя и статус текущей сделки
            const user = Meteor.users.findOne({ 'profile.id': tradeOffer.steamid_other });
            if (!user || tradeOffer.trade_offer_state !== 2) return;

            // Получение информации о текущей сделке
            getOffer(offers, tradeOffer);
          }));
        });
      }
    }
  }));
}

function getOffer(offers, tradeOffer) {
  offers.getOffer({ tradeofferid: tradeOffer.tradeofferid }, Meteor.bindEnvironment((err, result) => {
    if (err) return console.log(err);

    if (result && result.response && result.response.offer && result.response.offer.tradeid) {
      // Получение товаров по текущей сделке
      getItems(offers, result, tradeOffer);
    }
  }));
}

function getItems(offers, result, tradeOffer) {
  offers.getItems({ tradeId: result.response.offer.tradeid }, Meteor.bindEnvironment((err, result) => {
    if (err) return console.log(err);

    let offerItems = result;
    // Фильтрация полученных товаров
    offerItems = _.filter(offerItems, offerItem => {
      return offerItem.appid === 570 && offerItem.tradable === 1 && offerItem.marketable === 1;
    });

    formFinalItems(offers, offerItems, tradeOffer);
  }));
}

function formFinalItems(offers, offerItems, tradeOffer) {
  if (offerItems.length > 0) {
    // Начало формирования окончательного списка товаров
    let items = [];
    _.each(offerItems, offerItem => {
      let item = {
        assetId: offerItem.id,
        classId: offerItem.classid,
        icon: offerItem.icon_url_large,
        name: offerItem.market_hash_name,
        price: 0
      };
      items.push(item);
    });

    handleItemsPrices(offers, items, tradeOffer);
  }
}

function handleItemsPrices(offers, items, tradeOffer) {
  dbx.filesDownload({ path: '/items-prices.json' })
  .then(Meteor.bindEnvironment(data => {
    const itemsPrices = JSON.parse(data.fileBinary);

    // Извлечение цены для каждого товара
    _.each(items, item => {
      let name = item.name;
      _.each(itemsPrices, itemPrice => {
        if (name === itemPrice.n) {
          item.price = itemPrice.p;
        }
      });
    });
    // Фильтрация полученных товаров
    items = _.filter(items, item => {
      return item.price !== 0;
    });

    if (items.length > 0) {
      // Стоимость всех товаров
      let totalPrice = 0;
      _.each(items, item => {
        totalPrice += item.price;
      });
      // Проверка на лимит (min: $0.10 - max: $500)
      if (totalPrice < 10 || totalPrice > 50000) return;

      handleBet(offers, items, totalPrice, tradeOffer);
    }
  }))
  .catch(err => console.log(err));
}

function handleBet(offers, items, totalPrice, tradeOffer) {
  // К-во всех товаров
  const totalItems = items.length;

  const user = Meteor.users.findOne({ 'profile.id': tradeOffer.steamid_other });

  const bet = {
    createdAt: new Date(),
    userId: tradeOffer.steamid_other,
    items,
    totalPrice,
    totalItems,
    avatar: user.avatar,
    userName: user.userName,
    profileURL: user.profileURL
  };

  const id = Bets.insert(bet);

  handleGame(offers, id, totalPrice, totalItems);
}

function handleGame(offers, id, totalPrice, totalItems) {
  const games = Games.find({ status: { $in: ['start', 'go'] }}).fetch();
  
  if (games.length === 0) {
    // Создание новой игры
    const game = {
      createdAt: new Date(),
      jackpot: totalPrice,
      totalItems,
      status: 'start'
    };

    let gameId = Games.insert(game);
    // Обновление первой ставки
    Bets.update(id, { $set: { chance: 100, gameId }});
  } else {
    let gameId = games[0]._id;

    // Обновление текущей ставки
    Bets.update(id, { $set: { gameId }});
    
    const bets = Bets.find({ gameId }).fetch();

    // Обновление текущей игры
    // Джекпот
    let jackpot = 0;
    _.each(bets, bet => {
      jackpot += bet.totalPrice;
    });

    // К-во всех товаров
    totalItems = 0;
    _.each(bets, bet => {
      totalItems += bet.totalItems;
    });

    // Проверка пользователей на уникальность для изменения статуса игры
    let usersId = [];
    _.each(bets, bet => {
      usersId.push(bet.userId);
    });
    usersId = _.uniq(usersId);

    if (usersId.length > 1) {
      // Блокировка от нескольких игр подряд
      const endGames = Games.find({ status: { $in: ['in-process', 'finish'] }}).fetch();
      if (endGames.length > 0) {
        setTimeout(Meteor.bindEnvironment(() => {
          const timerCounter = Games.findOne({ _id: gameId, timerCounter: true });
          if (!timerCounter) {
            Games.update(gameId, { $set: { timerCounter: true, status: 'go' }});
            streamTimer();
            streamCircle(offers, gameId);
          }
        }), 8000);
      } else {
        const timerCounter = Games.findOne({ _id: gameId, timerCounter: true });
        if (!timerCounter) {
          Games.update(gameId, { $set: { timerCounter: true, status: 'go' }});
          streamTimer();
          streamCircle(offers, gameId);
        }
      }
    }


    Games.update(gameId, { $set: { jackpot, totalItems }});

    // Обновление всех ставок
    _.each(bets, bet => {
      const id = bet._id;
      const chance = +(bet.totalPrice * 100 / jackpot).toFixed(1);

      Bets.update(id, { $set: { chance }});
    });
  }
}

function handleWinner(offers, gameId) {
  const bets = Bets.find({ gameId }).fetch();

  const usersChance = [];
  _.each(bets, bet => {
    let userChance = {
      userId: bet.userId,
      chance: bet.chance
    };
    usersChance.push(userChance);
  });

  let allUsers = [];
  _.each(usersChance, userChance => {
    let chance = Math.round(userChance.chance);
    for (let i = 0; i < chance; i++) {
      allUsers.push(userChance.userId);
    }
  });

  allUsers = chancejs.shuffle(allUsers);
  const winnerId = chancejs.pickone(allUsers);

  const user = Meteor.users.findOne({ 'profile.id': winnerId });

  setTimeout(Meteor.bindEnvironment(() => {
    const id = Winners.insert({ createdAt: new Date(), gameId, winnerId, avatar: user.avatar, userName: user.userName, profileURL: user.profileURL });
    sendItems(offers, id);
    finishGame(gameId);
  }), 3000);
}

function finishGame(gameId) {
  Games.update(gameId, { $set: { status: 'finish' }});
  
  setTimeout(Meteor.bindEnvironment(() => {
    Games.update(gameId, { $set: { status: 'end' }});
  }), 3000);
}

function streamTimer() {
  let counter = 0;
  let time = 120;

  const intervalId = setInterval(() => {
    streamerRoulette.emit('timer', time);

    if (counter === 120) clearInterval(intervalId);
    counter += 1;
    time -= 1;
  }, 1000);
}

function streamCircle(offers, gameId) {
  let counter = 0;
  let percent = 100;

  const intervalId = setInterval(Meteor.bindEnvironment(() => {
    streamerRoulette.emit('circle', percent);

    if (counter === 100) {
      clearInterval(intervalId);
      Games.update(gameId, { $set: { status: 'in-process' }});
      handleWinner(offers, gameId);
    };
    counter += 1;
    percent -= 1;
  }), 1200);
}