import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import MessagesList from './MessagesList.jsx';
import ChatForm from './ChatForm.jsx';

export const ChatBlock = (props) => {
  return (
    <div className="chat-block">
      <div className="chat-title">Общение</div>
      <Scrollbars style={{ width: 245, height: 343 }}>
        <MessagesList messages={props.messages}/>
      </Scrollbars>
      <ChatForm/>
    </div>
  );
};