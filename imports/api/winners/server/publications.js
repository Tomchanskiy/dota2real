import { Meteor } from 'meteor/meteor';

import { Winners } from '../winners';

Meteor.publish('winners.public', function() {
  return Winners.find();
});