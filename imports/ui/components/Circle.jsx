import React, { Component } from 'react';
import CircularProgressbar from 'react-circular-progressbar';
import { BounceLoader } from 'halogen';

import GameInfo from './GameInfo.jsx';
import CircleWinner from './CircleWinner.jsx';

import { streamerRoulette } from '../../api/events/events';

export default class Circle extends Component {
  constructor(props) {
    super(props);

    this.state = { percent: 100 };

    this.renderByGameState = this.renderByGameState.bind(this);
  }

  componentDidMount() {
    streamerRoulette.on('circle', (percent) => {
      this.setState({ percent });
    });
  }

  componentWillUnmount() {
    streamerRoulette.stop('circle');
  }

  componentWillReceiveProps(nextProps) {
    const game = nextProps.game;
    if (!game || game.status === 'start') {
      this.setState({ percent: 100 });
    }  
  }

  renderByGameState() {
    const { game, bets, winners } = this.props;

    if (!game) return <GameInfo game={game} bets={bets} />;
    if (game.status === 'start' || game.status === 'go') return <GameInfo game={game} bets={bets} />;
    if (game.status === 'in-process') return <BounceLoader color="#30333e" size="300px" />;
    if (game.status === 'finish') return <CircleWinner winners={winners} game={game} />;
  }

  render() {
    return (
      <div className="circle">
        <CircularProgressbar percentage={this.state.percent} strokeWidth={10} />
        <div className="inner-circle">
          {this.renderByGameState()}
        </div>
      </div>
    );
  }
};