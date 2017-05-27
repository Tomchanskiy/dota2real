import { Meteor } from 'meteor/meteor';

import { Bets } from '../bets';

Meteor.publish('bets.public', function() {
  return Bets.find();
});