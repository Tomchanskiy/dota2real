import React from 'react';

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <div className="footer-full">
      <div className="footer">
        <div className="copyright">
          &copy; {year} dota2real
        </div>
        <div className="contact">
          <a href="mailto:info@dota2real.ru">info@dota2real.ru</a>
        </div>
      </div>
    </div>
  );
};