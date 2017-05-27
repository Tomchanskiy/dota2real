import React, { Component } from 'react';
import uuidV1 from 'uuid/v1';

export default class Bet extends Component {
  constructor(props) {
    super(props);

    this.renderItems = this.renderItems.bind(this);
  }

  declOfNum(number, titles) {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
  }

  renderItems() {
    const items = this.props.items;

    return items.map(item => {
      return <img key={uuidV1()} src={`https://steamcommunity-a.akamaihd.net/economy/image/class/570/${item.classId}/36fx24f`} alt={item.name} />
    });
  }

  render() {
    const { avatar, userName, profileURL, totalPrice, totalItems, chance } = this.props;
    const cleanWord = this.declOfNum(totalItems, ['вещь', 'вещи', 'вещей']);

    return (
      <div className="bet">
        <div className="user">
          <a href={profileURL}><img src={avatar} alt="avatar" /></a>
          <div className="win-chance">{chance}%</div>
        </div>
        <div className="bet-info">
          <div className="bet-desc">
            <a href={profileURL}>{userName}</a> - {totalItems} {cleanWord} на сумму ${totalPrice / 100}
          </div>
          <div className="bet-items">
            {this.renderItems()}
          </div>
        </div>
      </div>
    );
  }
};