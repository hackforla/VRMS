import React from 'react';
import './index.scss';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="text-block">
        <span>VRMS</span> was developed by Hack for LA
        <div className="tooltip">
          <span className="tooltip-icon">i</span>
          <div className="tooltip-content">
            Used for streamlining onboarding to new projects, find helpful
            meeting details, track your contributions, and maintain a profile of
            your skills and professional development.
            <Link
              key={'footer-page'}
              to={'/page'}
              className="tooltip-link redirect-link"
            >
              More details here.
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
