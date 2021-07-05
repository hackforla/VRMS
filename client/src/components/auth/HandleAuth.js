import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { isValidToken } from '../../services/user.service';

import '../../sass/MagicLink.scss';
import useAuth from '../../hooks/useAuth';

const HandleAuth = (props) => {
  const auth = useAuth();
  const [isMagicLinkValid, setMagicLink] = useState(null);

  useEffect(() => {
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const api_token = params.get('token');
    const isValid = isValidToken(api_token);
    setMagicLink(isValid);
  }, []);

  // Where is the user getting redirected to after login?  Let's find out!

  let loginRedirect;

  if (auth.user) {
    let userAccessLevel = auth.user.accessLevel;

    switch (userAccessLevel) {
      case 'admin':
        loginRedirect = '/admin';
        break;
      case 'user':
        loginRedirect = '/projects'
        break;
      default:
        // Actively do nothing.
    }
  }


  return auth.user && isMagicLinkValid ? (
    
    <Redirect to={loginRedirect} />
  ) : (
    <div className="flex-container">
      <div>Sorry, the link is not valid anymore.</div>
    </div>
  );
};

export default HandleAuth;
