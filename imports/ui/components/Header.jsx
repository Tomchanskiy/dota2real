import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';

class Header extends Component {
  constructor(props) {
    super(props);

    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.renderLoggedIn = this.renderLoggedIn.bind(this);
    this.renderLoggedOut = this.renderLoggedOut.bind(this);
  }

  cutUserName(userName) {
    if (!userName) return;
    
    if (userName.length < 26) {
      return userName;
    } else {
      const newUserName = userName.slice(0, 25) + '...';
      return newUserName;
    }
  }

  onLogin() { 
    Meteor.loginWithSteam({
      redirectUrl: 'https://www.dota2real.ru/'
    });
  }

  onLogout() {
    Meteor.logout();
    browserHistory.push('/');
  }

  renderLoggedIn() {
    const { userName, avatar } = this.props.user;

    return (
      <div className="logged-in">
        <div className="dropdown">
          <img src={avatar} alt="avatar" />
          <span>{this.cutUserName(userName)} <i className="fa fa-angle-down" aria-hidden="true"></i></span>
          <div className="dropdown-content">
            <ul>
              <li><Link to="/settings">Настройки</Link></li>
              <li><button type="button" className="btn-link" onClick={this.onLogout}>Выход</button></li>
            </ul>
          </div>
        </div>
        <a className="btn btn-site" href="https://steamcommunity.com/tradeoffer/new/?partner=389019732&token=o1Ucs3Xh">Через сайт</a>
        <a href="steam://url/SteamIDPage/76561198349285460" className="btn btn-client">Через клиент</a>
      </div>
    );
  }

  renderLoggedOut() {
    return (
      <button type="button" onClick={this.onLogin} className="btn btn-login">
        <i className="fa fa-steam" aria-hidden="true"></i>
        Войти через Steam
      </button>
    );
  }

  render() {
    return (
      <div className="header-full">
        <div className="header">
          <div className="left-block">
            <Link to="/"><img src="/img/logo.png" alt="logo" /></Link>
            <a href="https://bets.dota2real.ru" className="bets">Ставки</a>
          </div>
          <div className="right-block">
            <ul className="nav">
              <li><Link to="/how-to-play">Как играть?</Link></li>
              <li><Link to="/">Играть</Link></li>
              <li><Link to="/about">О сайте</Link></li>
            </ul>
            { this.props.user ? this.renderLoggedIn() : this.renderLoggedOut() }
          </div>
        </div>
      </div>
    );
  }
}

export default createContainer(() => {
  Meteor.subscribe('Meteor.users.public');

  return {
    user: Meteor.user()
  };
}, Header);