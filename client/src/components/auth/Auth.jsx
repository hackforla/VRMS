import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { checkUser, checkAuth } from '../../services/user.service';
import { authLevelRedirect } from '../../utils/authUtils';
import {
  Typography,
  Button,
  FormControl,
  Box,
  TextField
} from '@mui/material';

import useAuth from '../../hooks/useAuth';
import '../../sass/AdminLogin.scss';

/** At the moment only users with the 'admin' accessLevel can login
 * and see the dashboard
 **/
const Auth = () => {
  const LOG_IN = 'LOG_IN';
  const ADMIN = 'admin';
  const USER = 'user';
  const pattern = /\b[a-z0-9._]+@[a-z0-9.-]+\.[a-z]{2,4}\b/i;

  const history = useHistory();
  const { auth } = useAuth();

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
      const userData = await checkUser(email, LOG_IN);
      if (userData) {
        if (
          userData.user.accessLevel !== ADMIN &&
          userData.user.accessLevel === USER &&
          userData.user.managedProjects.length === 0
        ) {
          showError(
            "You don't have the correct access level to view the dashboard"
          );
          return;
        }

        const isAuth = await checkAuth(email, LOG_IN);
        if (isAuth) {
          history.push('/emailsent');
        } else {
          showError(
            'We don’t recognize your email address. Please, create an account.'
          );
        }
      } else {
        showError(
          'We don’t recognize your email address. Please, create an account.'
        );
      }
    }
  };

  function handleInputChange(e) {
    const inputValue = e.currentTarget.value.toString();
    validateEmail();
    if (!inputValue) {
      setIsDisabled(true);
      showError('Please enter a valid email address');
    } else {
      setIsDisabled(false);
      setIsError(false);
      setEmail(e.currentTarget.value.toString());
    }
  }

  // This allows users who are not admin, but are allowed to manage projects, to login
  let loginRedirect = '';
  if (auth?.user) {
    loginRedirect = authLevelRedirect(auth.user);
  }

  return auth?.user ? (
    <Redirect to={loginRedirect} />
  ) : (
    <div className="flex-container">
      <div className="adminlogin-container">
        <div className="adminlogin-headers">
        <Typography variant="h3" sx={{fontSize:'2.8em'}}>Welcome Back!</Typography>
        </div>
        <FormControl
          onSubmit={handleLogin}
          className="form-check-in"
          autoComplete="off"
        >
          <div className="form-row">
            <div className="form-input-text">
            <Box className="form-row">
                    <Box className="form-input-text">
                    <TextField
                        label = "Enter your email address:"
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

        <div
          className="adminlogin-warning"
          style={{ visibility: isError ? 'visible' : 'hidden' }}
        >
          {errorMessage}
        </div>

        <div className="form-input-button">
          <Button
            type="submit"
            onClick={handleLogin}
            className="login-button"
            data-test="login-btn"
            disabled={isDisabled}
            sx={{color: 'black'}}
          >
            LOGIN
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
