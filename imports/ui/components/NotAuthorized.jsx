import React from 'react';
import { Link } from 'react-router';

export const NotAuthorized = () => {
  return (
    <div className="main-full">
      <div className="main">
        <div className="not-authorized">
          <div className="title">Нет доступа</div>
          <div className="text">
            <h2>Упссс... Похоже у вас нет доступа к этой странице.</h2>
            <p>Но, вы можете войти через Steam или <Link to="/">вернуться на главную!</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};