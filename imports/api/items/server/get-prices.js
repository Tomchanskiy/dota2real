import backpacktf from 'backpacktf';
import Dropbox from 'dropbox';
import _ from 'underscore';

import { backpacktfKey } from '../../config-data';
import { accessToken } from '../../config-data';

const appId = 570;
const interval = 1000 * 60 * 60;

const dbx = new Dropbox({ accessToken });

// Периодическое получение данных о ценах товаров
setInterval(() => {
  backpacktf.getMarketPrices(backpacktfKey, appId, (err, data) => {
    if (err) return console.log(err);

    // Получение сырых данных о ценах товаров
    const rawItemsPrices = data.response.items;

    // Извлечение имени и цены каждого товара
    let itemsPrices = [];
    _.each(rawItemsPrices, (itemValue, itemName) => {
      let itemPrice = {
        n: itemName,
        p: itemValue.value
      };
      itemsPrices.push(itemPrice);
    });

    // Преобразование массива товаров в строку для дальнейшей загрузки на Dropbox
    itemsPrices = JSON.stringify(itemsPrices);

    dbx.filesUpload({
      contents: itemsPrices,
      path: '/items-prices.json',
      mode: {
        '.tag': 'overwrite'
      },
      autorename: false,
      mute: false
    })
    .then(response => {})
    .catch(err => console.log(err));
  });
}, interval);

