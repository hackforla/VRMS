import React from 'react';
import './footer.scss';
import RedirectLink from '../link/link';
import { useSelector } from 'react-redux';

const Footer = () => {
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const user = useSelector((state) => state.auth.user);

  return loggedIn && user ? (
    <footer data-testid="footer" className="inner-footer">
      <div className="text-block">Logged in as {user.email}</div>
    </footer>
  ) : (
    <footer data-testid="footer" className="app-footer">
      <div className="text-block">
        <span>VRMS</span> was developed by Hack for LA
        <div className="tooltip">
          <span className="tooltip-icon">i</span>
          <div data-testid="tooltip" className="tooltip-content">
            Used for streamlining onboarding to new projects, find helpful
            meeting details, track your contributions, and maintain a profile of
            your skills and professional development.
            <RedirectLink
              linkKey={'footer-page'}
              path={'/page'}
              className={`tooltip-link`}
              content={` More details here.`}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
