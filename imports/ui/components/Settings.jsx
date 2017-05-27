import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { createContainer } from 'meteor/react-meteor-data';

import ItemsList from './ItemsList.jsx';
import { NotAuthorized } from './NotAuthorized.jsx';

import { Items } from '../../api/items/items';
import '../../api/users/methods';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: '' };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.exchangeLink) {
      this.setState({ inputValue: nextProps.user.exchangeLink });
    }  
  }

  onChange(e) {
    this.setState({ inputValue: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const inputValue = this.state.inputValue;
    if (!Meteor.user() || !inputValue) return;

    Meteor.call('Meteor.users.updateExchangeLink', inputValue);
  }

  render() {
    const user = this.props.user;

    if (!user) return <NotAuthorized/>;

    return (
      <div className="main-full">
        <div className="main">
          <div className="settings">
            <div className="title">Настройки</div>
            <div className="exchange-block">
              <form onSubmit={this.onSubmit}>
                <input type="text" value={this.state.inputValue} onChange={this.onChange} placeholder="Ссылка на обмен"/>
                <button type="submit" className="btn btn-save">Сохранить</button>
              </form>
            </div>
            <div className="text">
              <div>Ссылку на обмен можно взять <a href="https://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url" target="_blank">здесь</a>.</div>
              <div>Чтобы бот смог отправить вам предметы, ваш инвентарь должен быть открытым.</div>
              <div>По умолчанию он скрыт и если вы его не открывали - <a href="https://steamcommunity.com/my/edit/settings/" target="_blank">откройте в настройках приватности</a>.</div>
            </div>
            <div className="inventory-block">
              <div className="total-price">Стоимость вашего инвентаря:&nbsp;
                <span>${ this.props.items ? this.props.items.totalPrice / 100 : 0 }</span>
              </div>
              <Scrollbars style={{ width: 800, height: 285 }}>
                <ItemsList items={this.props.items} />
              </Scrollbars>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default createContainer(() => {
  Meteor.subscribe('Meteor.users.public');
  Meteor.subscribe('items.public');

  return {
    user: Meteor.user(),
    items: Items.find().fetch()[0]
  };
}, Settings);