import React from 'react';
import './footer.scss';
import RedirectLink from '../link/link';
import { useUserContext, SignOutButton } from "../../auth";
const Footer = () => {
  const [awsUser] = useUserContext();
 
  const btnStyles = {
    display: "inline",
    padding: "0 10px",
    border: "none",
    color: "#007bff",
    backgroundColor: "transparent",
    textTransform: "none"
  }

  return awsUser ? (
    <footer data-testid="footer-logged-in" className="inner-footer">
      <div className="text-block">
        Logged in as {awsUser.attributes.email}
        <SignOutButton style={btnStyles} />
      </div>
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
