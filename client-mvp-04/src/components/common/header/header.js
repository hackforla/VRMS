import React, { useState } from 'react';
import './header.scss';
import logo from '../../../assets/images/logo.svg';
import RedirectLink from '../link/link';

const Header = () => {
  const [isOpenMenu, setOpenMenu] = useState(false);

  return (
    <header data-testid="header" className="app-header">
      <div className="menu-button-container">
        <div
          className={isOpenMenu ? 'active menu-button' : 'menu-button'}
          onClick={() => setOpenMenu(!isOpenMenu)}
        >
          <span className="line" />
          <span className="line" />
          <span className="line" />
        </div>
      </div>

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
