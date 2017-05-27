import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import ReactModal from 'react-modal';

import '../../api/messages/methods';

export default class ChatForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const message = this.refs.message.value.trim();
    
    if (!Meteor.user() || !message) return;
    
    Meteor.call('messages.insert', message);

    this.refs.message.value = '';
  }

  openModal(e) {
    e.preventDefault();
    this.setState({ showModal: true });
  }

  closeModal(e) {
    e.preventDefault();
    this.setState({ showModal: false });
  }

  render() {
    const modalStyle = {
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
      },
      content: {
        border: 'none',
        borderRadius: 0,
        padding: 0,
        background: 'transparent',
        top: '150px'
      }
    };

    return (
      <div className="chat-form">
        <form className="clearfix" onSubmit={this.handleSubmit}>
          <textarea ref="message" rows="3" placeholder="Введите сообщение..."></textarea>
          <button type="submit" className="btn btn-chat">Отправить</button>
          <span><a href="/show-rules" onClick={this.openModal}>Правила чата</a></span>
        </form>
        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="Modal"
          style={modalStyle}>
            <div className="modal-chat">
              <div className="close" onClick={this.closeModal}>&times;</div>
              <div className="modal-title">
                Правила чата
              </div>
              <div className="modal-rules">
                <ul>
                  <li>Используйте только русский или английский язык.</li>
                  <li>Не попрошайничайте.</li>
                  <li>Не спамьте.</li>
                  <li>Не рекламируйте сторонние сервисы или услуги.</li>
                  <li>Не оскорбляйте других участников.</li>
                </ul>
              </div>
              <div className="modal-subtext">За любое нарушение вышеизложенных правил, пользователь будет заблокирован.</div>
              <div className="modal-thanks">Спасибо за понимание и хорошей вам игры!</div>
            </div>
        </ReactModal>
      </div>
    );
  }
}