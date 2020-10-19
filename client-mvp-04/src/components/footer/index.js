import React from 'react';
import './index.scss';

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
            <span className="tooltip-link">More details here.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
