import React, { useState, useEffect, createContext, useContext } from 'react';
import { Auth } from 'aws-amplify';
import { securedFetch } from '../../utils/securedFetch';

const UserContext = createContext();

/* Custom hook - useful for ease of testing */
export const useUserContext = () => useContext(UserContext);

/* Provides a global data store for authentication.  Exposes for objects:
   - awsUser: user information pulled from identity provider
   - appUser: user information pulled from app database
   - state: used by auth compenents to track loading state.  Possible values: init | loading | loaded
   - refreshUserInfo: method used to trigger a refresh of authentication data (such as when a new user complets the sign up step)
 */
export const UserProvider = ({ children }) => {
  const [awsUser, setAwsUser] = useState();
  const [appUser, setAppUser] = useState();
  const [state, setState] = useState("init"); // init | loading | loaded

  useEffect(() => {
    if(state === "loading") 
      return;
    if(!awsUser) {
      setAppUser(null);
      setState("init");
    } else {
      const fetchAppUser = async () => {
        const response = await securedFetch("/api/users/self");
        if(response.status !== 200) {
          setAppUser(null);  
          setState("loaded");
        } else {
          const data = await response.json();
          setAppUser(data);  
          setState("loaded");
        }  
      }

      fetchAppUser();
    }

  // Purposely omitting the [state] dependency to reduce round trips to server.
  }, [awsUser, setAppUser, setState]); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshUserInfo = async () => {
    await setState("init");
    const authUserInfo = await Auth.currentUserInfo();
    setAwsUser(authUserInfo);
  }
  
  return (
    <UserContext.Provider value={[awsUser, appUser, state, refreshUserInfo]}>
      { children }
    </UserContext.Provider>
  );
};
