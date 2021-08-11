import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { isValidToken } from '../../services/user.service';
import {authLevelRedirect} from '../../utils/authUtils'

import '../../sass/MagicLink.scss';
import useAuth from '../../hooks/useAuth';

const HandleAuth = (props) => {
  const [auth, refreshAuth] = useAuth();
  const [isMagicLinkValid, setMagicLink] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Step 1: Validate token from query string
  useEffect(() => {
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const api_token = params.get('token');

    if(!api_token) return;
    isValidToken(api_token).then((isValid) => {
      setMagicLink(isValid)
    });
  }, []);

  // Step 2: Refresh user auth (requires valid Magic Link)
  useEffect(() => {
    if(!isMagicLinkValid) return;
    if(!auth?.isError) return;

    refreshAuth();
  },[isMagicLinkValid, refreshAuth])

  // Step 3: Set IsLoaded value to render Component
  useEffect(() => {
    if(!isMagicLinkValid) {
      setIsLoaded(true);
      return;
    };

    if(!auth || auth.isError) return;
    
    setIsLoaded(true);
    },[isMagicLinkValid, auth?.isError, setIsLoaded])

  if(!isLoaded) 
    return (
      <div>Loading...</div>
    );

  if (auth?.user) {
    const loginRedirect = authLevelRedirect(auth.user);
    return (
      <Redirect to={loginRedirect} />
    );
  }

  return (
    <div className="flex-container">
      <div>Sorry, the link is not valid anymore.</div>
    </div>
  );
};

export default HandleAuth;
