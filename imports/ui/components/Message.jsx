import React, { Component } from 'react';

export default class Message extends Component {
  render() {
    return (
      <div className="message-block">
        <div className="user">
          <a href={this.props.profileURL}><img src={this.props.avatar} alt="avatar" /></a>
        </div>
        <div className="message-info">
          <div className="message-desc clearfix">
            <a href={this.props.profileURL}>{this.props.userName}:</a>
            <span>{this.props.time}</span>
          </div>
          <div className="message">
            <p>{this.props.text}</p>
          </div>
        </div>
      </div>
    );
  }
};