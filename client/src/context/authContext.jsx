import { createContext, useState, useEffect } from 'react';
import { REACT_APP_CUSTOM_REQUEST_HEADER as headerToSend } from '../utils/globalSettings';
import * as authApi from '../api/auth';
import { useHistory } from 'react-router-dom';
import { isAdmin } from '../../../shared/authorizationUtils';
import { ROLES } from '../../../shared/roles';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState();
  const history = useHistory();

  useEffect(() => {
    refreshAuth();
  }, []);

  const refreshAuth = async () => {
    const userAuth = await fetchAuth();
    setAuth(userAuth);
  };

  const logout = async () => {
    const res = await authApi.fetchLogout();

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    history.push('/');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, refreshAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const fetchAuth = async () => {
  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-customrequired-header': headerToSend,
    },
  };

  try {
    // check for refresh token
    // if refresh token exists, obtain new jwt
    console.log('ROLES:', ROLES);
    console.log('isAdmin:', typeof isAdmin);

    const testUser = { accessLevel: ROLES.ADMIN };
    console.log('Is admin?', isAdmin(testUser)); // true

    const response = await fetch('/api/auth/me', request);
    if (response.status !== 200)
      return { user: null, isAdmin: false, isError: true };

    const user = await response.json();
    return {
      user,
      isAdmin: isAdmin(user),
      isError: false,
    };
  } catch (error) {
    // this should never be hit...
    console.error('fetchAuth - error', error);
  }
};
