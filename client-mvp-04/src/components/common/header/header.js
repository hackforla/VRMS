import React from 'react';
import './header.scss';
import logo from '../../../assets/images/logo.svg';
import RedirectLink from '../link/link';

const Header = () => {
  return (
    <header data-testid="header" className="app-header">
      <RedirectLink
        linkKey={'header-home-link'}
        path={'/'}
        content={
          <img data-testid="logo" src={logo} className="app-logo" alt="logo" />
        }
      />
    </header>
  );
};

export default Header;
