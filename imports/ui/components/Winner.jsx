import React from 'react';

export const Winner = (props) => {
  return (
    <div className="winner">
      <div className="winner-username">
        Победитель: <a href={props.profileURL}>{props.userName}</a>
      </div>
      <div className="winner-info">
        Шанс на победу - {props.chance}%. Выигрыш - ${props.jackpot / 100}
      </div>
    </div>
  );
};