import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Steam from 'steam-webapi';

import { steamAPIKey } from '../../config-data';

Accounts.onLogin(() => {
  const userId = Meteor.userId();
  const userSteamId = Meteor.user().profile.id;

  Steam.ready(steamAPIKey, Meteor.bindEnvironment(err => {
    if (err) return console.log(err);

    const steam = new Steam({ key: steamAPIKey, gameid: Steam.DOTA2 });

    steam.getPlayerSummaries({ key: steamAPIKey, steamids: userSteamId }, Meteor.bindEnvironment((err, data) => {
      if (err) return console.log(err);

      // Получение данных пользователя
      const userData = data.players[0];
      const userName = userData.personaname;
      const profileURL = userData.profileurl;
      const avatar = userData.avatarfull;

      // Обновление данных пользователя
      Meteor.users.update(userId, { $set: { userName, profileURL, avatar } });
    }));
  }));
});