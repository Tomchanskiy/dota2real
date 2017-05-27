import React from 'react';

import { Statistics } from './Statistics.jsx';
import Circle from './Circle.jsx';

export const RouletteBlock = (props) => {
  return (
    <div className="roulette-block">
      <Statistics />
      <Circle game={props.game} bets={props.bets} winners={props.winners} />
    </div>
  );
};