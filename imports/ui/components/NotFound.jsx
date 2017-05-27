import React from 'react';
import { Link } from 'react-router';

export const NotFound = () => {
  return(
    <div className="main-full">
      <div className="main">
        <div className="not-found">
          <div className="title">Страницу не найдено</div>
          <div className="text">
            <h2>Упссс... Похоже этой страницы не существует.</h2>
            <p>Но, вы можете <Link to="/">вернуться на главную!</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};