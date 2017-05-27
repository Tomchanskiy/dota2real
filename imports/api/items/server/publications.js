import { Meteor } from 'meteor/meteor';

import { Items } from '../items';

Meteor.publish('items.public', function() {
  return Items.find({ userId: this.userId }, {
    fields: { items: 1, totalPrice: 1, userId: 1 }
  });
});