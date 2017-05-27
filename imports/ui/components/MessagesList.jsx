import React, { Component } from 'react';
import moment from 'moment';

import Message from './Message.jsx';

export default class MessagesList extends Component {
  constructor(props) {
    super(props);

    this.renderMessages = this.renderMessages.bind(this);
  }

  renderMessages() {
    if (this.props.messages.length === 0) return;

    const messages = this.props.messages;
    return messages.map(message => {
      return (
        <Message
          key={message._id}
          text={message.text}
          time={moment(message.time).format('HH:mm')}
          avatar={message.avatar}
          profileURL={message.profileURL}
          userName={message.userName}/>
      );
    });
  }

  render() {
    return (
      <div className="messages-list">
        {this.renderMessages()}
      </div>
    );
  }
}