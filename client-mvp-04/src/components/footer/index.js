import React from 'react';
import './index.scss';
import RedirectLink from '../common/link';

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
            <RedirectLink
              linkKey={'footer-page'}
              path={'/page'}
              className={`tooltip-link`}
              content={`More details here.`}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
