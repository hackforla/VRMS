import React, { useState } from 'react';
import './auth.scss';
import Button from '../common/button/button';
import { checkAuth } from '../../services/user.service';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { AUTH_ORIGIN } from '../../utils/constants';

const Auth = () => {
  const user = useSelector((state) => state.auth.user);
  const [LOG_IN, ,] = AUTH_ORIGIN;
  const [isMessageShow, setMessage] = useState(false);

  const handleButton = async () => {
    const isAuth = await checkAuth(user.email, LOG_IN);
    if (isAuth) setMessage(true);

    setTimeout(() => {
      setMessage(false);
    }, 5000);
  };

  return user ? (
    <div className="flex-container auth">
      <div className="auth-content">
        Please verify your email via magic link in your inbox
      </div>

      <Button
        type={'text'}
        content={`Resend Link`}
        className={'btn-square auth-button'}
        onClick={() => handleButton()}
      />

      {isMessageShow ? (
        <div className="resend-link-msg">
          A new link has been sent to your email
        </div>
      ) : null}
    </div>
  ) : (
    <Redirect to="/login" />
  );
};

export default Auth;
