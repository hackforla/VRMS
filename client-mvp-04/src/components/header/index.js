import React from 'react';
import './index.scss';
import logo from '../../assets/images/logo.svg';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="app-header">
      <Link key={'header-home'} to={'/'} className="redirect-link">
        <img src={logo} className="app-logo" alt="logo" />
      </Link>
    </header>
  );
};

export default Header;
