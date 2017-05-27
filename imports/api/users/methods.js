import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

Meteor.methods({
  'Meteor.users.updateExchangeLink'(exchangeLink) {
    const validationContext = new SimpleSchema({
      exchangeLink: {
        type: String,
        regEx: SimpleSchema.RegEx.Url
      }
    }).newContext();
    validationContext.validate({ exchangeLink });

    if (!validationContext.isValid() || !Meteor.userId()) return;

    Meteor.users.update(Meteor.userId(), { $set: { exchangeLink } });
  }
});