import { Meteor } from 'meteor/meteor';

import { Games } from '../games';

Meteor.publish('games.public', function() {
  return Games.find();
});