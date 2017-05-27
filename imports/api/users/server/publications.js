import { Meteor } from 'meteor/meteor';

Meteor.publish('Meteor.users.public', function() {
  return Meteor.users.find(this.userId, {
      fields: { userName: 1, profileURL: 1, avatar: 1, exchangeLink: 1  }
    }
  );
});