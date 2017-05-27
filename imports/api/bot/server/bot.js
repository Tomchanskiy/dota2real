import { Meteor } from 'meteor/meteor';
import Steam from 'steam';
import SteamWebLogOn from 'steam-weblogon';
import SteamTradeOffers from 'steam-tradeoffers';
import SteamTotp from 'steam-totp';
import SteamcommunityMobileConfirmations from 'steamcommunity-mobile-confirmations';
import Dropbox from 'dropbox';

import { steamAPIKey } from '../../config-data';
import { accessToken } from '../../config-data';
import { sharedSecret } from '../../config-data';
import { identitySecret } from '../../config-data';

import { getSHA1 } from './get-sha1';
import { handleOffers } from './handle-offers';

const steamClient = new Steam.SteamClient();
const steamUser = new Steam.SteamUser(steamClient);
const steamFriends = new Steam.SteamFriends(steamClient);
const steamWebLogOn = new SteamWebLogOn(steamClient, steamUser);
const offers = new SteamTradeOffers();

const logOnOptions = {
  account_name: 'dota2real_bot',
  password: 'd2rb2016D',
  two_factor_code: SteamTotp.generateAuthCode(sharedSecret)
};

const dbx = new Dropbox({ accessToken });

dbx.filesDownload({ path: '/sentry' })
.then(data => {
  logOnOptions.sha_sentryfile = getSHA1(data.fileBinary);

  dbx.filesDownload({ path: '/servers.json' })
  .then(data => {
    Steam.servers = JSON.parse(data.fileBinary);
    steamClient.connect();
  })
  .catch(err => console.log(err));
})
.catch(err => console.log(err));

steamClient.on('connected', () => {
  steamUser.logOn(logOnOptions);
});

steamClient.on('logOnResponse', Meteor.bindEnvironment(logonResp => {
  if (logonResp.eresult === Steam.EResult.OK) {
    steamFriends.setPersonaState(Steam.EPersonaState.Online);

    steamWebLogOn.webLogOn(Meteor.bindEnvironment((sessionID, newCookie) => {
      offers.setup({ sessionID, webCookie: newCookie, APIKey: steamAPIKey });
      const steamcommunityMobileConfirmations = new SteamcommunityMobileConfirmations({
        steamid: '76561198349285460',
        identity_secret: identitySecret,
        device_id: SteamTotp.getDeviceID('76561198349285460'),
        webCookie: newCookie
      });
      setInterval(() => {
        steamcommunityMobileConfirmations.FetchConfirmations((err, confirmations) => {
          if (err) return console.log(err);
          
          if (confirmations.length > 0) {
            steamcommunityMobileConfirmations.AcceptConfirmation(confirmations[0], (err, result) => {
              if (err) return console.log(err);
            });
          }
        });
      }, 1000 * 60 * 10);
      handleOffers(offers);
    }));
  }
}));

steamClient.on('servers', servers => {
  const serversList = JSON.stringify(servers);

  dbx.filesUpload({
    contents: serversList,
    path: '/servers.json',
    mode: {
      '.tag': 'overwrite'
    },
    autorename: false,
    mute: false
  })
  .then(response => {})
  .catch(err => console.log(err));
});

steamClient.on('error', (err) => {
  console.log('Oh my God! It is fucking terrible ERROR!');
  console.log(err);
});

steamUser.on('updateMachineAuth', (sentry, callback) => {
  dbx.filesUpload({
    contents: sentry.bytes,
    path: '/sentry',
    mode: {
      '.tag': 'overwrite'
    },
    autorename: false,
    mute: false
  })
  .then(response => {})
  .catch(err => console.log(err));

  callback({ sha_file: getSHA1(sentry.bytes) });
});

steamUser.on('tradeOffers', Meteor.bindEnvironment(number => {
  if (number > 0) {
    handleOffers(offers);
  }
}));
