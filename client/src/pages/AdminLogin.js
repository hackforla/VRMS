import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import '../sass/AdminLogin.scss';

/** At the moment only users with the 'admin' accessLevel can login
 * and see the dashboard
 **/
const AdminLogin = () => {
  const history = useHistory();
  const auth = useAuth();

  const [email, setEmail] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const CHECK_USER = '/api/checkuser';
  const HEADERS = {
    'Content-Type': 'application/json',
    'x-customrequired-header': process.env.REACT_APP_CUSTOM_REQUEST_HEADER,
  };
  const auth_origin = 'LOG_IN';
  const SIGN_IN = '/api/auth/signin';
  const ADMIN = 'admin';

  const isValidEmail = (email) => {
    const pattern = /\b[a-z0-9._]+@[a-z0-9.-]+\.[a-z]{2,4}\b/i;
    return email.search(pattern) !== -1;
  };

  async function checkUser(email) {
    try {
      const response = await fetch(CHECK_USER, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ email: email, auth_origin: auth_origin }),
      });
      return await response.json();
    } catch (error) {
      console.log('User is not registered in the app');
      console.log(error);
      return null;
    }
  }

  async function checkAuth(email) {
    try {
      const response = await fetch(SIGN_IN, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ email: email, auth_origin: auth_origin }),
      });
      return response.status === 200;
    } catch (error) {
      console.log('User is not authorized in app');
      console.log(error);
      return null;
    }
  }

  const handleLogin = async () => {
    if (isValidEmail(email)) {
      setIsDisabled(false);
      const userData = await checkUser(email);
      if (userData) {
        if (userData.user.accessLevel !== ADMIN) {
          setIsError(true);
          setErrorMessage(
            "You don't have the correct access level to view the dashboard"
          );
          return;
        }

        const isAuth = await checkAuth(email);
        if (isAuth) {
          history.push('/emailsent');
        } else {
          setIsError(true);
          setErrorMessage(
            'We don’t recognize your email address. Please, create an account.'
          );
        }
      } else {
        setIsError(true);
        setErrorMessage(
          'We don’t recognize your email address. Please, create an account.'
        );
      }
    } else {
      setIsDisabled(true);
      setIsError(true);
      setErrorMessage('Please enter a valid email address');
    }
  };

  function handleInputChange(e) {
    const inputValue = e.currentTarget.value.toString();
    if (!inputValue) {
      setIsDisabled(true);
      setIsError(true);
      setErrorMessage('Please enter a valid email address');
    } else {
      setIsDisabled(false);
      setIsError(false);
      setEmail(e.currentTarget.value.toString());
    }
  }

  return auth.user ? (
    <Redirect to="/admin" />
  ) : (
    <div className="flex-container">
      <div className="adminlogin-container">
        <div className="adminlogin-headers">
          <h3>Welcome Back!</h3>
        </div>
        <form
          className="form-check-in"
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="form-row">
            <div className="form-input-text">
              <label htmlFor="email">Enter your email address:</label>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleInputChange}
                aria-label="Email Address"
                data-test="input-email"
                autoComplete="email"
                required="required"
              />
            </div>
          </div>
        </form>

        {isError && <div className="adminlogin-warning">{errorMessage}</div>}

        <div className="form-input-button">
          <button
            onClick={handleLogin}
            className="login-button"
            data-test="login-btn"
            disabled={isDisabled}
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
