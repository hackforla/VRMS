import { Box, Button, FormControl, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { checkAuth, checkUser } from '../../services/user.service';

import useAuth from '../../hooks/useAuth';
import '../../sass/AdminLogin.scss';

/** User-facing copy for every login failure we can distinguish.
 * Keyed by the error codes returned from checkUser; see the contract in
 * backend/routers/checkUser.router.js. Keeping the wording here rather than in
 * the API response means NETWORK_ERROR -- which no server can report, because
 * no server answered -- reads like every other message.
 **/
const AUTH_ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address',
  USER_NOT_FOUND: 'We don’t recognize your email address. Please, create an account.',
  INSUFFICIENT_ACCESS: "You don't have the correct access level to view the dashboard",
  SERVER_ERROR: 'We’re experiencing technical difficulties. Please try again later.',
  NETWORK_ERROR: 'The login service is temporarily unavailable.',
  // This is for future use when we add password-based login.
  // AUTH_CREDENTIALS_ERROR: 'Incorrect email or password.',
};

/** Falls back to the server's own message for a code this client predates,
 * then to the generic failure when there is nothing usable at all.
 **/
const messageForError = ({ code, message }) =>
  AUTH_ERROR_MESSAGES[code] ?? message ?? AUTH_ERROR_MESSAGES.SERVER_ERROR;

/** At the moment only users with the 'admin' accessLevel can login
 * and see the dashboard
 **/
const Auth = () => {
  const LOG_IN = 'LOG_IN';
  const ADMIN = 'admin';
  const USER = 'user';
  const pattern = /\b[a-z0-9._]+@[a-z0-9.-]+\.[a-z]{2,4}\b/i;

  const history = useHistory();
  const { auth, getLoginRedirect } = useAuth();

  const [email, setEmail] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(' ');

  const validateEmail = () => {
    if (email.search(pattern) !== -1) {
      setIsDisabled(false);
      return true;
    } else {
      setIsDisabled(true);
      showError('Please enter a valid email address');
      return false;
    }
  };

  const showError = (message) => {
    setIsError(true);
    setErrorMessage(message);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail();

    if (isEmailValid) {
      const result = await checkUser(email, LOG_IN);

      if (!result.ok) {
        showError(messageForError(result));
        return;
      }

      if (
        result.user.accessLevel !== ADMIN &&
        result.user.accessLevel === USER &&
        result.user.managedProjects.length === 0
      ) {
        showError(AUTH_ERROR_MESSAGES.INSUFFICIENT_ACCESS);
        return;
      }

      const isAuth = await checkAuth(email, LOG_IN);
      if (isAuth) {
        history.push('/emailsent');
      } else {
        showError(AUTH_ERROR_MESSAGES.USER_NOT_FOUND);
      }
    }
  };

  function handleInputChange(e) {
    const inputValue = e.currentTarget.value.toString().toLowerCase();
    validateEmail();
    if (!inputValue) {
      setIsDisabled(true);
      showError('Please enter a valid email address');
    } else {
      setIsDisabled(false);
      setIsError(false);
      setEmail(e.currentTarget.value.toString().toLowerCase());
    }
  }

  // This allows users who are not admin, but are allowed to manage projects, to login

  return auth?.user ? (
    <Redirect to={getLoginRedirect()} />
  ) : (
    <div className="flex-container">
      <div className="adminlogin-container">
        <div className="adminlogin-headers">
          <Typography variant="h3" sx={{ fontSize: '2.8em' }}>
            Welcome Back!
          </Typography>
        </div>
        <form onSubmit={handleLogin} className="form-check-in" autoComplete="off">
          <FormControl>
            <div className="form-row">
              <div className="form-input-text">
                <Box className="form-row">
                  <Box className="form-input-text">
                    <TextField
                      label="Enter your email address:"
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      required="required"
                      onChange={handleInputChange}
                      aria-label="Email Address"
                      data-test="input-email"
                      autoComplete="email"
                    />
                  </Box>
                </Box>
              </div>
            </div>
          </FormControl>
        </form>

        <div className="adminlogin-warning" style={{ visibility: isError ? 'visible' : 'hidden' }}>
          {errorMessage}
        </div>

        <div className="form-input-button">
          <Button
            type="submit"
            onClick={handleLogin}
            className="login-button"
            data-test="login-btn"
            disabled={isDisabled}
            sx={{ color: 'black' }}
          >
            LOGIN
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
