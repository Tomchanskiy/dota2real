import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import request from 'request-json';
import Dropbox from 'dropbox';
import _ from 'underscore';

import { Items } from '../items';
import { accessToken } from '../../config-data';

const gameId = 570;

const client = request.createClient('http://steamcommunity.com/');
const dbx = new Dropbox({ accessToken });

Accounts.onLogin(() => {
  const userId = Meteor.userId();
  const userSteamId = Meteor.user().profile.id;
  const path = `/inventory/${userSteamId}/${gameId}/2?l=english&count=5000`;

  client.get(path, Meteor.bindEnvironment((err, res, body) => {
    if (err) return console.log(err);

    // Получение сырых данных о товарах
    let rawAssets = body.assets;
    const rawDescriptions = body.descriptions;

    rawAssets = _.filter(rawAssets, rawAsset => {
      return rawAsset.appid === '570';
    });

    if (rawAssets.length === 0) {
      Items.upsert({ userId }, { $set: { items: rawAssets, totalPrice: 0, userSteamId, userId } });
    }

    const rawItems = [];
    _.each(rawAssets, rawAsset => {
      const classId = rawAsset.classid;
      const rawItem = _.find(rawDescriptions, rawDescription => {
        return classId === rawDescription.classid;
      });
      if (rawItem) rawItems.push(rawItem);
    });

    // Извлечение данных для каждого товара
    const items = [];
    _.each(rawItems, itemValue => {
      let item = {
        classId: itemValue.classid,
        icon: itemValue.icon_url_large,
        name: itemValue.market_hash_name,
        price: 0
      };
      items.push(item);
    });

    dbx.filesDownload({ path: '/items-prices.json' })
    .then(Meteor.bindEnvironment(data => {
      // Преобразование строки товаров в объект
      const itemsPrices = JSON.parse(data.fileBinary);
      
      // Извлечение цены для каждого товара
      _.each(items, itemValue => {
        const name = itemValue.name;
        _.each(itemsPrices, itemPriceValue => {
          if (name === itemPriceValue.n) {
            itemValue.price = itemPriceValue.p;
          }
        });
      });

      // Стоимость всех товаров
      let totalPrice = 0;
      _.each(items, itemValue => {
        totalPrice += itemValue.price;
      });

      // Обновление данных о товарах пользователя
      Items.upsert({ userId }, { $set: { items, totalPrice, userId } });
    }))
    .catch(err => console.log(err));
  }));
});