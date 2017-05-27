import React from 'react';

export const Statistics = () => {
  return (
    <div className="statistics">
      <div className="statistics-block">
        <div className="counter-title">Проведено игр за сегодня</div>
        <div className="counter-value">35</div>
      </div>

      <div className="statistics-block">
        <div className="counter-title">Пользователей онлайн</div>
        <div className="counter-value">11</div>
      </div>

      <div className="statistics-block">
        <div className="counter-title">Максимальный выигрыш</div>
        <div className="counter-value">$154</div>
      </div>
    </div>
  );
};