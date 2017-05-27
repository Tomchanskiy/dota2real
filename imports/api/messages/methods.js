import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import { Messages } from './messages';

Meteor.methods({
  'messages.insert'(message) {
    const validationContext = new SimpleSchema({
      message: { type: String }
    }).newContext();
    validationContext.validate({ message });

    if (!validationContext.isValid() || !Meteor.userId()) return;

    const text = message.trim();
    const avatar = Meteor.user().avatar;
    const profileURL = Meteor.user().profileURL;
    const userName = Meteor.user().userName;

    Messages.insert({ text, time: new Date(), avatar, profileURL, userName });
  }
});