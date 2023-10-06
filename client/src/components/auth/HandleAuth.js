import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { isValidToken } from '../../services/user.service';
import { authLevelRedirect } from '../../utils/authUtils';

import '../../sass/MagicLink.scss';
import useAuth from '../../hooks/useAuth';

const HandleAuth = (props) => {
  const { auth, refreshAuth } = useAuth();
  const [isMagicLinkValid, setMagicLink] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Step 1: Validate token from query string
  useEffect(() => {
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const api_token = params.get('token');

    if (!api_token) return;
    isValidToken(api_token).then((isValid) => {
      setMagicLink(isValid);
    });
  }, [props.location.search]);

  // Step 2: Refresh user auth (requires valid Magic Link)
  useEffect(() => {
    if (!isMagicLinkValid) return;
    if (!auth?.isError) return;

    refreshAuth();
  }, [isMagicLinkValid, refreshAuth, auth]);

  // Step 3: Set IsLoaded value to render Component
  useEffect(() => {
    if (!isMagicLinkValid) {
      setIsLoaded(true);
      return;
    }

    if (!auth || auth.isError) return;

    setIsLoaded(true);
  }, [isMagicLinkValid, setIsLoaded, auth]);

  if (!isLoaded) return <div>Loading...</div>;

  const Delayed = ({ children, waitBeforeShow = 500 }) => {
    const [isShown, setIsShown] = useState(false);
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsShown(true);
      }, waitBeforeShow);

      return () => clearTimeout(timer);
    }, [waitBeforeShow]);

    return isShown ? children : null;
  };

  let loginRedirect = '';

  if (auth?.user) {
    loginRedirect = authLevelRedirect(auth.user);
  }

  return (
    <div className="flex-container">
      <Delayed waitBeforeShow={1000}>
        <div>Sorry, the link is not valid anymore.</div>
      </Delayed>
      {auth?.user && <Redirect to={loginRedirect} /> /* Redirect to /welcome */}
    </div>
  );
};

export default HandleAuth;
