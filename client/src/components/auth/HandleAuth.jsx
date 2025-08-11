import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { isValidToken } from '../../services/user.service';
import { authLevelRedirect } from '../../utils/authUtils';
import { Box, CircularProgress, Typography } from '@mui/material';

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
    if (!isMagicLinkValid) return;

    if (!auth || auth.isError) return;

    setIsLoaded(true);
  }, [isMagicLinkValid, setIsLoaded, auth]);

  // const Delayed = ({ children, waitBeforeShow = 500 }) => {
  //   const [isShown, setIsShown] = useState(false);
  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       setIsShown(true);
  //     }, waitBeforeShow);

  //     return () => clearTimeout(timer);
  //   }, [waitBeforeShow]);

  //   return isShown ? children : null;
  // };

  useEffect(() => {
    if (!isLoaded) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  let loginRedirect = '';

  if (auth?.user) {
    loginRedirect = authLevelRedirect(auth.user);
  }

  return (
    <Box textAlign="center" sx={{ pt: 5, fontSize: '16px' }}>
      {!isLoaded ? (
        <CircularProgress />
      ) : (
        <Typography variant="p">
          Sorry, the link is not valid anymore.
        </Typography>
      )}
      {auth?.user && <Redirect to={loginRedirect} /> /* Redirect to /welcome */}
    </Box>
  );
};

export default HandleAuth;
