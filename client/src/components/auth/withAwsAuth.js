import React, { useState, useEffect } from 'react';
import Amplify from 'aws-amplify';
import { AmplifyAuthContainer, AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';

import { AUTH_CONFIG } from '../../utils/constants';
import logo from "../../assets/images/logo.svg";
import { UserProvider } from "./UserContext";
import './withAwsAuth.scss';

Amplify.configure(AUTH_CONFIG);

/* Higher Order Component used to integrate top level app with AWS Cognito.
 */
export const withAwsAuth = (Component) => props => {
  const [authState, setAuthState] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData)
    });
  }, [user]);

  if(authState === AuthState.SignedIn && user) 
    return (
      <UserProvider>
        <Component {...props} />
      </UserProvider>
    );

  return (<AuthPage />);
}

// VRMS Project compatible AWS Cognito UI
const AuthPage = () => (
  <div className="app">
    <div className="app-container">
      <header className="app-header">
        <img data-testid="logo" src={logo} className="app-logo" alt="logo" />
      </header>
      <main className="app-main">
        <h1 className="title-short">VRMS</h1>
        <AmplifyAuthContainer>
          <AmplifyAuthenticator usernameAlias="email">
            <AmplifySignUp 
              slot="sign-up"
              usernameAlias="email"
              formFields={[
                {
                  type: "email",
                  label: "Email Address *",
                  placeholder: "Enter your email address",
                  inputProps: { required: true, autocomplete: "email" },
                },
                {
                  type: "password",
                  label: "Password *",
                  placeholder: "Enter your password",
                  inputProps: { required: true, autocomplete: "new-password" },
                }
              ]} 
            />
          </AmplifyAuthenticator>
        </AmplifyAuthContainer>
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
