import React from 'react';
import './dashboard.scss';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import profileIcon from '../../assets/images/icons/profile.png';
import projectsIcon from '../../assets/images/icons/projects.png';
import communityIcon from '../../assets/images/icons/community.png';
import teamIcon from '../../assets/images/icons/team.png';
import adminToolsIcon from '../../assets/images/icons/adminTools.png';

const DashboardNav = () => {
  const userProfile = useSelector((state) => state.auth.userProfile);

  return (
    <div className="dashboard-nav">
      <Link
        className="redirect-link dash-nav-item"
        key="dash-profile-link"
        data-testid="dash-profile-item"
        to="/page"
      >
        <div className="icon-wrapper">
          <img src={profileIcon} className="item-icon" alt="profile" />
        </div>
        <span className="item-name">Profile</span>
      </Link>

      <Link
        className="redirect-link dash-nav-item"
        key="dash-projects-link"
        data-testid="dash-projects-item"
        to="/page"
      >
        <div className="icon-wrapper">
          <img src={projectsIcon} className="item-icon" alt="projects" />
        </div>
        <span className="item-name">Projects</span>
      </Link>

      <Link
        className="redirect-link dash-nav-item"
        key="dash-community-link"
        data-testid="dash-community-item"
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

      {userProfile && userProfile.isAdmin ? (
        /*Display Team Join Requests for PM and Admin*/
        <>
          <Link
            className="redirect-link dash-nav-item"
            key="dash-team-link"
            data-testid="dash-team-item"
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

          <Link
            className="redirect-link dash-nav-item"
            key="dash-admin-tools-link"
            data-testid="dash-admin-tools-item"
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
        </>
      ) : null}
    </div>
  );
};

export default DashboardNav;
