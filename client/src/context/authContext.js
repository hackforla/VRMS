import React, { createContext, useState, useEffect } from 'react';
import { REACT_APP_CUSTOM_REQUEST_HEADER } from "../utils/globalSettings";
import * as authApi from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState();

    useEffect(() => {
      refreshAuth();
    }, []);

    const refreshAuth = async () => {
      const userAuth = await fetchAuth();
      setAuth(userAuth)
    }

    const logout = async () => {
      const res = await authApi.fetchLogout();

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      setAuth(null);
    }
    
    return (
        <AuthContext.Provider value={{auth, refreshAuth, logout}}>
            { children }
        </AuthContext.Provider>
    );
};

const fetchAuth = async () => {
  const headerToSend = REACT_APP_CUSTOM_REQUEST_HEADER;


  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-customrequired-header": headerToSend
    },
  };

  try{
    const response = await fetch("/api/auth/me", request);
    if(response.status !== 200)
      return {user: null, isAdmin: false, isError: true };

    const user = await response.json();
    console.log("User:", user)  // This needs to be deleted later
    return { user, isAdmin: user.accessLevel === 'admin', isError: false };
  }
  catch (error) {
    // this should never be hit...
    console.error("fetchAuth - error", error);
  }
}