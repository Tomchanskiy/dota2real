import React, { Component } from 'react';
import _ from 'underscore';

import { streamerRoulette } from '../../api/events/events';

export default class GameInfo extends Component {
  constructor(props) {
    super(props);
    this.state = { time: 120 };

    this.renderChance = this.renderChance.bind(this);
  }

  componentDidMount() {
    streamerRoulette.on('timer', (time) => {
      this.setState({ time });
    });
  }

  componentWillUnmount() {
    streamerRoulette.stop('timer');
  }

  timeToTimer(time) {
    let timer = '';
    const minutes = `0${Math.floor(time / 60)}`;
    let seconds = `${time % 60}`;
    if (seconds.length == 1) {
      seconds = `0${seconds}`;
    }
    return timer = `${minutes}:${seconds}`;
  }

  renderChance() {
    const userSteamId = Meteor.user() ? Meteor.user().profile.id : null;
    let { bets, game } = this.props;
    let chance = 0;

    if (!userSteamId || !game) return chance;

    bets = _.filter(bets, bet => {
      return bet.userId === userSteamId;
    });
    if (bets.length === 0) return chance;

    bets = _.filter(bets, bet => {
      return bet.gameId === game._id;
    });
    if (bets.length === 0) return chance;

    _.each(bets, bet => {
      chance += bet.chance;
    });
    if (chance > 100) chance = 100;

    chance = Math.round(chance);
    return chance;
  }

  render() {
    const game = this.props.game;

    return (
      <div className="game-info">
        <div className="jackpot-title">Джекпот</div>
        <div className="jackpot">${game ? game.jackpot / 100 : 0}</div>
        <div className="start-time">Время до старта: <span>{this.timeToTimer(this.state.time)}</span></div>
        <div className="chance">Шанс на победу: <span>{this.renderChance()}%</span></div>
        <div className="total-items">Всего предметов: <span>{game ? game.totalItems : 0}</span></div>
      </div>
    );
  }
};