import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import BetsList from './BetsList.jsx';

export const BetsBlock = (props) => {
  return (
    <div className="bets-block">
      <div className="room-title">Главная комната</div>
      <div className="room-limit">min: $0.10 - max: $500</div>
      <Scrollbars style={{ width: 400, height: 466 }}>
        <BetsList bets={props.bets} games={props.games} winners={props.winners} />
      </Scrollbars>
    </div>
  );
}