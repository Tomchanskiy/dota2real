import React, { Component } from 'react';
import _ from 'underscore';

import { Winner } from './Winner.jsx';
import Bet from './Bet.jsx';

export default class BetsList extends Component {
  constructor(props) {
    super(props);

    this.handleCurrentGame = this.handleCurrentGame.bind(this);
    this.renderCurrentGame = this.renderCurrentGame.bind(this);
    this.handleEndedGames = this.handleEndedGames.bind(this);
    this.renderEndedGame = this.renderEndedGame.bind(this);
    this.renderWinner = this.renderWinner.bind(this);
    this.renderBets = this.renderBets.bind(this);
  }

  handleCurrentGame() {
    const { bets, games, winners } = this.props;

    if (games.length === 0 || bets.length === 0) return;

    let currentGame = _.filter(games, game => {
      return game.status !== 'end';
    });

    if (currentGame.length === 0) return;

    currentGame = currentGame[0];
    const gameBets = _.filter(bets, bet => {
      return bet.gameId === currentGame._id;
    });

    let winner;
    if (winners.length > 0) {
      winner = _.find(winners, winner => {
        return winner.gameId === currentGame._id;
      });
    }

    const currentGameBlock = this.renderCurrentGame(currentGame, gameBets, winner);
    return currentGameBlock;
  }

  renderCurrentGame(currentGame, gameBets, winner) {
    gameBets.reverse();

    const gameBetsWithChance = [];
    _.each(gameBets, bet => {
      const userId = bet.userId;
      let chance = 0;
      _.each(gameBets, bet => {
        if (bet.userId === userId) chance += bet.chance;
      });
      chance = Math.round(chance);
      const newBet = _.clone(bet);
      newBet.chance = chance;
      gameBetsWithChance.push(newBet);
    });

    if (winner) {
      const winnerBet = _.find(gameBetsWithChance, gameBetWithChance => {
        return gameBetWithChance.userId === winner.winnerId;
      });
      winner.chance = winnerBet.chance;
    }

    return (
      <div className="current-game" key={currentGame._id}>
        {this.renderWinner(currentGame, winner)}
        {this.renderBets(gameBetsWithChance)}
      </div>
    );
  }

  handleEndedGames() {
    const { bets, games, winners } = this.props;
    if (games.length === 0 || bets.length === 0 || winners.length === 0) return;

    const endedGames = _.filter(games, game => {
      return game.status === 'end';
    });
    if (endedGames.length === 0) return;

    endedGames.reverse();

    const endedGamesBlock = [];
    _.each(endedGames, endedGame => {
      const winner = _.find(winners, winner => {
        return winner.gameId === endedGame._id;
      });

      const gameBets = _.filter(bets, bet => {
        return bet.gameId === endedGame._id;
      });

      const endedGameBlock = this.renderEndedGame(endedGame, gameBets, winner);
      endedGamesBlock.push(endedGameBlock);
    });

    return endedGamesBlock.map(endedGameBlock => {
      return endedGameBlock;
    });
  }

  renderEndedGame(endedGame, gameBets, winner) {
    gameBets.reverse();

    const gameBetsWithChance = [];
    _.each(gameBets, bet => {
      const userId = bet.userId;
      let chance = 0;
      _.each(gameBets, bet => {
        if (bet.userId === userId) chance += bet.chance;
      });
      chance = Math.round(chance);
      const newBet = _.clone(bet);
      newBet.chance = chance;
      gameBetsWithChance.push(newBet);
    });

    const winnerBet = _.find(gameBetsWithChance, gameBetWithChance => {
      return gameBetWithChance.userId === winner.winnerId;
    });
    winner.chance = winnerBet.chance;

    return (
      <div className="ended-game" key={endedGame._id}>
        {this.renderWinner(endedGame, winner)}
        {this.renderBets(gameBetsWithChance)}
      </div>
    );
  }

  renderWinner(game, winner) {
    if (!winner) return;

    return <Winner userName={winner.userName} profileURL={winner.profileURL} chance={winner.chance} jackpot={game.jackpot} />;
  }

  renderBets(gameBets) {
    return gameBets.map(bet => {
      return <Bet key={bet._id} avatar={bet.avatar} userName={bet.userName} profileURL={bet.profileURL} totalPrice={bet.totalPrice} totalItems={bet.totalItems} chance={bet.chance} items={bet.items} />;
    });
  }

  render() {
    return (
      <div className="bets-list">
        {this.handleCurrentGame()}
        {this.handleEndedGames()}
      </div>
    );
  }
}