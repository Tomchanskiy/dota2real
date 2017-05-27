import { Meteor } from 'meteor/meteor';
import _ from 'underscore';

import { Games } from '../games';
import { Bets } from '../../bets/bets';
import { Winners } from '../../winners/winners';

const interval = 1000 * 60 * 60;

removeGames = () => {
  const gamesCount = Games.find({ status: 'end' }).count();

  if (gamesCount > 15) {
    const limit = gamesCount - 15;
    const removeIds = Games.find({ status: 'end' }, { limit }).fetch().map(game => {
      return game._id;
    });

    Games.remove({ _id: { $in: removeIds }});
    Bets.remove({ gameId: { $in: removeIds }});
    Winners.remove({ gameId: { $in: removeIds }});
  }
};

setInterval(Meteor.bindEnvironment(() => {
  removeGames();
}), interval);