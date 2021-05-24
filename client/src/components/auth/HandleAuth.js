import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import '../../sass/MagicLink.scss';

const HandleAuth = (props) => {
  const [isMagicLinkValid, setMagicLink] = useState(null);
  const headerToSend = process.env.REACT_APP_CUSTOM_REQUEST_HEADER;

  async function isValidToken() {
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const api_token = params.get('token');

    try {
      const response = await fetch('/api/auth/verify-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': api_token,
          'x-customrequired-header': headerToSend,
        },
      });
      // eslint-disable-next-line no-unused-vars
      const body = await response;
      setMagicLink(response.status === 200);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    isValidToken();
  }, []);

  if (isMagicLinkValid) {
    return <Redirect to="/admin" />;
  } else {
    return (
      <div className="flex-container">
        <div>Sorry, the link is not valid.</div>
      </div>
    );
  }
};

export default HandleAuth;
