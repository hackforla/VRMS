import { createContext, useState, useEffect } from 'react';
import { REACT_APP_CUSTOM_REQUEST_HEADER as headerToSend } from '../utils/globalSettings';
import * as authApi from '../api/auth';
import { useHistory } from 'react-router-dom';
// Key authorization methods are imported from shared utils
// which is used by both frontend and backend to ensure consistent authorization logic across the app
import {
  hasRole as checkHasRole,
  hasAnyRole as checkHasAnyRole,
  hasMinimumRole as checkHasMinimumRole,
  isSuperAdmin as checkIsSuperAdmin,
  isAdmin as checkIsAdmin,
  isProjectManager as checkIsProjectManager,
} from '../../../shared/authorizationUtils';
import posthog from 'posthog-js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState();
  const history = useHistory();

  // On mount, check if user has valid session (HttpOnly cookies)
  useEffect(() => {
    refreshAuth();
  }, []);

  // Auto-refresh access token before it expires
  useEffect(() => {
    if (!auth?.user || !auth?.expiresAt) return;

    const expirationTime = auth.expiresAt;
    const timeUntilExpiry = expirationTime - Date.now();

    // If token already expired or expires in less than 1 minute, refresh immediately
    if (timeUntilExpiry <= 60000) {
      refreshAuth();
      return;
    }

    // Set timeout to refresh 1 minute before expiry
    const timeout = setTimeout(() => {
      console.log('Auto-refreshing access token...');
      refreshAuth();
    }, timeUntilExpiry - 60000);

    return () => clearTimeout(timeout);
  }, [auth?.expiresAt, auth?.user]);

  const refreshAuth = async () => {
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-customrequired-header': headerToSend,
      },
      credentials: 'include', // Send HttpOnly cookies (access + refresh tokens)
    };

    try {
      const response = await fetch('/api/auth/refresh-access-token', request);

      if (response.status !== 200) {
        // No valid session - clear auth state
        setAuth(null);
        return;
      }

      const data = await response.json();

      // Store user data and expiry time (tokens are in HttpOnly cookies)
      // Backend should return: { user, expiresAt: timestamp }
      setAuth(data);
    } catch (error) {
      console.error('refreshAuth error:', error);
      setAuth(null);
    }
  };

  const logout = async () => {
    const res = await authApi.fetchLogout();

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    history.push('/');
    setAuth(null);
  };

  // Returns true if user is logged in (auth state has a user object)
  const loggedIn = () => !!auth?.user;

  // Wrapper methods that use current auth state
  const hasRole = (role) => {
    return checkHasRole(auth?.user, role);
  };

  const hasAnyRole = (...roles) => {
    return checkHasAnyRole(auth?.user, ...roles);
  };

  const hasMinimumRole = (minimumRole) => {
    return checkHasMinimumRole(auth?.user, minimumRole);
  };

  const isSuperAdmin = () => {
    return checkIsSuperAdmin(auth?.user);
  };

  // Checks if user is Admin, SuperAdmin
  const isAdmin = () => {
    return checkIsAdmin(auth?.user);
  };

  // Checks if user is Project Manager
  const isProjectManager = () => {
    return checkIsProjectManager(auth?.user);
  };

  const getLoginRedirect = () => {
    if (!auth?.user) return '/';

    // For now, all authenticated users go to /welcome
    // Future: Could redirect based on role
    // if (isSuperAdmin()) return '/admin';
    // if (isAdmin()) return '/admin';
    // if (isProjectManager()) return '/projects';
    return '/welcome';
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        refreshAuth,
        logout,
        loggedIn,
        hasRole,
        hasAnyRole,
        hasMinimumRole,
        isSuperAdmin,
        isAdmin,
        isProjectManager,
        getLoginRedirect,
      }}
    >
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
    const response = await fetch('/api/auth/me', request);
    if (response.status !== 200)
      return { user: null, isAdmin: false, isError: true };

    const user = await response.json();

    posthog.identify(
      user._id,
      {
        email: user.email,
        name: `${user.name.firstName} ${user.name.lastName}`,
      }
    );

    return { user, isAdmin: (user.accessLevel === 'admin' || user.accessLevel === 'superadmin'), isError: false };
  } catch (error) {
    // this should never be hit...
    console.error('fetchAuth - error', error);
  }
};
