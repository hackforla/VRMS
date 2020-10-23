import React from 'react';
import './index.scss';
import logo from '../../assets/images/logo.svg';
import RedirectLink from '../common/link';

const Header = () => {
  return (
    <header className="app-header">
      <RedirectLink
        linkKey={'header-home-link'}
        path={'/'}
        content={<img src={logo} className="app-logo" alt="logo" />}
      />
    </header>
  );
};

export default Header;
