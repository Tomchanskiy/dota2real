import { Meteor } from 'meteor/meteor';

import { Messages } from '../messages';

Meteor.publish('messages.public', function() {
  return Messages.find();
});