import React, { createContext, useState, useEffect } from 'react';
import { REACT_APP_CUSTOM_REQUEST_HEADER } from "../utils/globalSettings";

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
    
    return (
        <AuthContext.Provider value={[auth, refreshAuth]}>
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
    return { user, isAdmin: user.accessLevel === 'admin', isError: false };
  }
  catch (error) {
    // this should never be hit...
    console.error("fetchAuth - error", error);
  }
}
