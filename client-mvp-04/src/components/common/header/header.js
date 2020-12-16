import React from 'react';
import './header.scss';
import logo from '../../../assets/images/logo.svg';
import RedirectLink from '../link/link';

const Header = ({ toggleMenu, isMenuOpen }) => {
  return (
    <header data-testid="header" className="app-header">
      {/* Show for authorized user */}
      <div className="menu-button-container">
        <div
          className={isMenuOpen ? 'active menu-button' : 'menu-button'}
          onClick={() => toggleMenu()}
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
