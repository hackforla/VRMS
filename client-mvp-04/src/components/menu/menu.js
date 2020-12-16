import React from 'react';
import './menu.scss';
import dashboardIcon from '../../assets/images/icons/dashboard.svg';
import profileIcon from '../../assets/images/icons/profile.svg';
import projectsIcon from '../../assets/images/icons/projects.svg';
import communityIcon from '../../assets/images/icons/community.svg';
import teamIcon from '../../assets/images/icons/team.svg';
import adminToolsIcon from '../../assets/images/icons/adminTools.svg';
import logoutIcon from '../../assets/images/icons/logout.svg';
import RedirectLink from '../common/link/link';

const Menu = ({ toggleMenu, isMenuOpen }) => {
  return isMenuOpen ? (
    <div className="menu-container">
      {/* Redirect the user to the dummy page while pages are not implemented */}
      <div className="menu-item" onClick={() => toggleMenu()}>
        <RedirectLink
          className="menu-item-content"
          linkKey="menu-dashboard-link"
          dataTestid="menu-dashboard-item"
          path="/page"
          content={
            <>
              <div className="icon-wrapper">
                <img
                  src={dashboardIcon}
                  className={'menu-icon'}
                  alt="dashboard"
                />
              </div>
              <span className={'menu-name'}>Dashboard</span>
            </>
          }
        />
      </div>

      <div className="menu-item" onClick={() => toggleMenu()}>
        <RedirectLink
          className="menu-item-content"
          linkKey="menu-profile-link"
          dataTestid="menu-profile-item"
          path="/page"
          content={
            <>
              <div className="icon-wrapper">
                <img src={profileIcon} className="menu-icon" alt="profile" />
              </div>
              <span className="menu-name">Profile</span>
            </>
          }
        />
      </div>

      <div className="menu-item" onClick={() => toggleMenu()}>
        <RedirectLink
          className="menu-item-content"
          linkKey="menu-projects-link"
          dataTestid="menu-projects-item"
          path="/page"
          content={
            <>
              <div className="icon-wrapper">
                <img src={projectsIcon} className="menu-icon" alt="projects" />
              </div>
              <span className="menu-name">Projects</span>
            </>
          }
        />
      </div>

      <div className="menu-item" onClick={() => toggleMenu()}>
        <RedirectLink
          className="menu-item-content"
          linkKey="menu-community-link"
          dataTestid="menu-community-item"
          path="/page"
          content={
            <>
              <div className="icon-wrapper">
                <img
                  src={communityIcon}
                  className="menu-icon"
                  alt="Community of Practice"
                />
              </div>
              <span className="menu-name">Community of Practice</span>
            </>
          }
        />
      </div>

      <div className="menu-item" onClick={() => toggleMenu()}>
        <RedirectLink
          className="menu-item-content"
          linkKey="menu-team-link"
          dataTestid="menu-team-item"
          path="/page"
          content={
            <>
              <div className="icon-wrapper">
                <img
                  src={teamIcon}
                  className="menu-icon"
                  alt="Team Join Requests"
                />
              </div>
              <span className="menu-name">Team Join Requests</span>
            </>
          }
        />
      </div>

      <div className="menu-item" onClick={() => toggleMenu()}>
        <RedirectLink
          className="menu-item-content"
          linkKey="menu-admin-tools-link"
          dataTestid="menu-admin-tools-item"
          path="/page"
          content={
            <>
              <div className="icon-wrapper">
                <img
                  src={adminToolsIcon}
                  className="menu-icon"
                  alt="Admin Tools"
                />
              </div>
              <span className="menu-name">Admin Tools</span>
            </>
          }
        />
      </div>

      <div className="menu-item" onClick={() => toggleMenu()}>
        <RedirectLink
          className="menu-item-content"
          linkKey="menu-logout-link"
          dataTestid="menu-logout-item"
          path="/page"
          content={
            <>
              <div className="icon-wrapper">
                <img src={logoutIcon} className="menu-icon" alt="Log Out" />
              </div>
              <span className="menu-name">Log Out</span>
            </>
          }
        />
      </div>
    </div>
  ) : null;
};

export default Menu;
