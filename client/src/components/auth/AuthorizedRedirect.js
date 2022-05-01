import React, { useState, useEffect } from 'react';
import { Redirect, useLocation  } from 'react-router-dom';

import logo from "../../assets/images/logo.svg";
import { useUserContext } from "./UserContext";

/* Located immediately after the <Router>, this component does two things:
   - Acts as a splash screen during user authentication
   - Redirects new users to the /signup page
 */
export const AuthorizedRedirect = ({children}) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [, appUser, state, refreshUserInfo] = useUserContext();
  
  useEffect(() => {
    if(state === "init" && !isLoading) {
      refreshUserInfo();
      setIsLoading(true);
    }
  },[state, isLoading, setIsLoading, refreshUserInfo])

  if(state !== "loaded")
    return <LoadingPage />

  // New User - redirect to new user form
  if(state === "loaded" && !appUser && location.pathname !== "/signup")
    return <Redirect to="/signup" />

  return (
    <>
      {children}
    </>
  );
}

const LoadingPage = () => {
  return (  
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <img data-testid="logo" src={logo} className="app-logo" alt="logo" />
        </header>
        <main className="app-main">
          <h1 className="title-short">VRMS</h1>
          <div>Loading...</div>
        </main>
        <footer data-testid="footer" className="app-footer">
          <div className="text-block">
            <span>VRMS</span> was developed by Hack for LA
            <div className="tooltip">
              <span className="tooltip-icon">i</span>
              <div data-testid="tooltip" className="tooltip-content">
                Used for streamlining onboarding to new projects, find helpful
                meeting details, track your contributions, and maintain a profile of
                your skills and professional development.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
