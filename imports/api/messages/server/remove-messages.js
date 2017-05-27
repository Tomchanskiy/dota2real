import { Meteor } from 'meteor/meteor';
import { Messages } from '../messages';

const interval = 1000 * 60 * 60;

const removeMessages = () => {
  const messagesCount = Messages.find().count();

  if (messagesCount > 20) {
    const limit = messagesCount - 20;
    const removeIds = Messages.find({}, { limit }).fetch().map(message => {
      return message._id;
    });
    Messages.remove({ _id: { $in: removeIds } });
  }
};

// Периодическое удаление лишних сообщений с коллекции Messages
setInterval(Meteor.bindEnvironment(() => {
  removeMessages();
}), interval);