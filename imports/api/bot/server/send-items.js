import { Meteor } from 'meteor/meteor';
import _ from 'underscore';

import { Winners } from '../../winners/winners';
import { Bets } from '../../bets/bets';

export const sendItems = (offers, id) => {
  offers.loadMyInventory({ appId: 570, contextId: 2 }, Meteor.bindEnvironment((err, items) => {
    if (err) return console.log(err);

    const winner = Winners.findOne(id);
    const gameId = winner.gameId;
    const winnerId = winner.winnerId;

    const bets = Bets.find({ gameId }).fetch();
    const betsItems = [];
    _.each(bets, bet => {
      _.each(bet.items, betItem => {
        betsItems.push(betItem);
      });
    });

    const itemsCount = betsItems.length;
    if (itemsCount > 10) {
      const commision = Math.round(10 * itemsCount / 100);
      betsItems.splice(0, commision);
    }

    const itemsFromMe = [];
    _.each(betsItems, betItem => {
      const assetId = betItem.assetId;
      const item = _.find(items, item => {
        return assetId === item.id;
      });
      if (!item) return;
      let newItem = {
        appid: item.appid,
        contextid: item.contextid,
        amount: item.amount,
        assetid: item.id
      };
      itemsFromMe.push(newItem);
    });

    const exchangeLink = Meteor.users.findOne({ 'profile.id': winnerId }).exchangeLink;
    if (!exchangeLink) {
      /*const intervalId = setInterval(Meteor.bindEnvironment(() => {
        const newExchangeLink = Meteor.users.findOne({ 'profile.id': winnerId }).exchangeLink;

        if (newExchangeLink) {
          const accessToken = newExchangeLink.slice(newExchangeLink.indexOf('token=') + 6);

          offers.makeOffer({
            partnerSteamId: winnerId,
            accessToken,
            itemsFromMe,
            itemsFromThem: [],
            message: 'Ваш выигрыш (dota2real)'
          }, (err, response) => {
            if (err) return console.log(err);
          });

          clearInterval(intervalId);
        }
      }), 1000 * 60 * 60 * 6);*/
      return;
    }

    const accessToken = exchangeLink.slice(exchangeLink.indexOf('token=') + 6);

    offers.makeOffer({
      partnerSteamId: winnerId,
      accessToken,
      itemsFromMe,
      itemsFromThem: [],
      message: 'Ваш выигрыш (dota2real)'
    }, (err, response) => {
      if (err) return console.log(err);
    });
  }));
}