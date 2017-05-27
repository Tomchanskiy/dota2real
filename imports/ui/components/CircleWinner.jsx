import React, { Component } from 'react';
import _ from 'underscore';

export default class CircleWinner extends Component {
  constructor(props) {
    super(props);

    this.handleWinner = this.handleWinner.bind(this);
  }

  handleWinner() {
    const { game, winners } = this.props;
    let winner = {};

    if (!winners || !game) {
      winner.avatar = '',
      winner.userName = '';
      return winner;
    }

    winner = _.find(winners, winner => {
      return winner.gameId === game._id;
    });

    if (!winner) {
      winner.avatar = '',
      winner.userName = '';
    }
    return winner;
  }

  render() {
    const winner = this.handleWinner();

    return (
      <div className="circle-winner">
        <div className="winner-title">Победитель</div>
        <img className="winner-avatar" src={winner.avatar} alt="avatar"/>
        <div className="winner-username">{winner.userName}</div>
      </div>
    );
  }
};