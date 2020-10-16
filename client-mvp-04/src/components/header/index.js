import React from 'react';
import './index.scss';
import logo from '../../assets/images/logo.svg';

const Header = () => {
  return (
    <header className="app-header">
      <img src={logo} className="app-logo" alt="logo" />
    </header>
  );
};

export default Header;
