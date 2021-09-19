import React, { useState, useEffect } from 'react';
import Amplify, { Auth } from 'aws-amplify';
import { AmplifyAuthContainer, AmplifyAuthenticator } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';

import './awsAuth.scss';
import { AUTH_CONFIG } from '../../utils/constants';
import { securedFetch } from "../../utils/securedFetch"

Amplify.configure(AUTH_CONFIG);

const AuthStateApp = () => {
  const [authState, setAuthState] = useState();
  const [user, setUser] = useState();
  const [userInfo, setUserInfo] = useState();
  const [testData, setTestData] = useState();

  useEffect(() => {
      return onAuthUIStateChange((nextAuthState, authData) => {
          setAuthState(nextAuthState);
          setUser(authData)
      });
  }, []);
  useEffect(() => {
    if(user) {
      Auth.currentUserInfo().then(v => setUserInfo(v));
    } else {
      setUserInfo(null);
    }
  }, [user]);

  const onClick = () => {
    securedFetch("http://localhost:3000/api/employees/auth")
      .then(response => response.text())
      .then(data => {
        setTestData(data);
      });
  }
  const signOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  return authState === AuthState.SignedIn && user ? (
      <div className="App">
          <div>Hello, {userInfo?.attributes?.email}</div>
          <hr />
          <div>
            <button type="button" onClick={onClick}>Fetch Data</button>
            <textarea readOnly value={testData} />
          </div>
          <hr />
          <button type="button" onClick={signOut}>Sign Out</button>
      </div>
    ) : (
      <AmplifyAuthContainer>
        <AmplifyAuthenticator />
      </AmplifyAuthContainer>
  );
}

export default AuthStateApp;
