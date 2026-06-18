import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { isValidToken } from '../../services/user.service';
import { Box, CircularProgress, Typography } from '@mui/material';

import '../../sass/MagicLink.scss';
import useAuth from '../../hooks/useAuth';

const HandleAuth = (props) => {
  const { auth, refreshAuth, getLoginRedirect } = useAuth();
  const [isMagicLinkValid, setMagicLink] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Step 1: Validate token from query string
  useEffect(() => {
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const api_token = params.get('token');

    if (!api_token) return;
    // Validates token and creates HttpOnly cookies (access + refresh tokens)
    isValidToken(api_token).then((isValid) => {
      setMagicLink(isValid);
    });
  }, [props.location.search]);

  // Step 2: After magic link is validated, refresh auth to get user data
  useEffect(() => {
    if (isMagicLinkValid) {
      refreshAuth();
    } else {
      // Invalid magic link - show error immediately
      setIsLoaded(true);
    }
  }, [isMagicLinkValid]);

  // Step 3: Once we have user data, we're ready to redirect
  useEffect(() => {
    if (auth?.user) {
      setIsLoaded(true);
    }
  }, [auth]);

  return (
    <Box textAlign="center" sx={{ pt: 5, fontSize: '16px' }}>
      {!isLoaded ? (
        <CircularProgress />
      ) : (
        <Typography variant="p">
          Sorry, the link is not valid anymore.
        </Typography>
      )}
      {
        auth?.user && (
          <Redirect to={getLoginRedirect()} />
        ) /* Redirect to /welcome */
      }
    </Box>
  );
};

export default HandleAuth;
