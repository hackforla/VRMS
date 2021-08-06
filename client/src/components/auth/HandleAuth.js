import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { isValidToken } from '../../services/user.service';
import {authLevelRedirect} from '../../utils/authUtils'

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

  // check user accessLevel and redirect to the appropriate page
  let loginRedirect = ''; 
  if (auth.user) {
    loginRedirect = authLevelRedirect(auth.user?.accessLevel);
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
