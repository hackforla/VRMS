import React from 'react';
import './menu.scss';
import dashboardIcon from '../../assets/images/icons/dashboard.png';
import profileIcon from '../../assets/images/icons/profile.png';
import projectsIcon from '../../assets/images/icons/projects.png';
import communityIcon from '../../assets/images/icons/community.png';
import teamIcon from '../../assets/images/icons/team.png';
import adminToolsIcon from '../../assets/images/icons/adminTools.png';
import logoutIcon from '../../assets/images/icons/logout.png';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import allActions from '../../store/actions';

const Menu = () => {
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const user = useSelector((state) => state.auth.user);
  const isMenuOpen = useSelector((state) => state.dashboard.isMenuOpen);
  const dispatch = useDispatch();

  function handleClickOnMenuItem(e) {
    if (e.target.parentElement.parentElement.className === 'menu-item') {
      dispatch(allActions.dashboardActions.closeMenu());
    }
  }

  return loggedIn && user ? (
    <>
      <div className={isMenuOpen ? 'bg-overlay active' : 'bg-overlay'} />

      <div
        className={isMenuOpen ? 'menu-container open' : 'menu-container'}
        data-testid="menu"
        onClick={(e) => handleClickOnMenuItem(e)}
      >
        {/* Redirect the user to the dummy page while pages are not implemented */}
        <div className="menu-item">
          <Link
            className="redirect-link menu-item-content"
            key="menu-dashboard-link"
            data-testid="menu-dashboard-link"
            to="/dashboard"
          >
            <div className="icon-wrapper">
              <img
                src={dashboardIcon}
                className="item-icon"
                alt="dashboard"
                data-testid="item-icon"
              />
            </div>
            <span className="item-name">Dashboard</span>
          </Link>
        </div>

        <div className="menu-item">
          <Link
            className="redirect-link menu-item-content"
            key="menu-profile-link"
            data-testid="menu-profile-link"
            to="/page"
          >
            <div className="icon-wrapper">
              <img src={profileIcon} className="item-icon" alt="profile" />
            </div>
            <span className="item-name">Profile</span>
          </Link>
        </div>

        <div className="menu-item">
          <Link
            className="redirect-link menu-item-content"
            key="menu-projects-link"
            data-testid="menu-projects-link"
            to="/page"
          >
            <div className="icon-wrapper">
              <img src={projectsIcon} className="item-icon" alt="projects" />
            </div>
            <span className="item-name">Projects</span>
          </Link>
        </div>

        <div className="menu-item">
          <Link
            className="redirect-link menu-item-content"
            key="menu-community-link"
            data-testid="menu-community-link"
            to="/page"
          >
            <div className="icon-wrapper">
              <img
                src={communityIcon}
                className="item-icon"
                alt="Community of Practice"
              />
            </div>
            <span className="item-name">Community of Practice</span>
          </Link>
        </div>

        {user && user.accessLevel === 'admin' ? (
          /*Display Team Join Requests for PM and Admin when API will be implemented*/
          <>
            <div className="menu-item">
              <Link
                className="redirect-link menu-item-content"
                key="menu-team-link"
                data-testid="menu-team-link"
                to="/page"
              >
                <div className="icon-wrapper">
                  <img
                    src={teamIcon}
                    className="item-icon"
                    alt="Team Join Requests"
                  />
                </div>
                <span className="item-name">Team Join Requests</span>
              </Link>
            </div>

            <div className="menu-item">
              <Link
                className="redirect-link menu-item-content"
                key="menu-admin-tools-link"
                data-testid="menu-admin-tools-link"
                to="/page"
              >
                <div className="icon-wrapper">
                  <img
                    src={adminToolsIcon}
                    className="item-icon"
                    alt="Admin Tools"
                  />
                </div>
                <span className="item-name">Admin Tools</span>
              </Link>
            </div>
          </>
        ) : null}

        <div className="menu-item">
          <Link
            className="redirect-link menu-item-content"
            key="menu-logout-link"
            data-testid="menu-logout-link"
            to="/page"
          >
            <div className="icon-wrapper">
              <img src={logoutIcon} className="item-icon" alt="Log Out" />
            </div>
            <span className="item-name">Log Out</span>
          </Link>
        </div>
      </div>
    </>
  ) : null;
};

export default Menu;
