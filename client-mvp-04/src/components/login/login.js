import React from 'react';
import './login.scss';
import Button from '../common/button/button';
import RedirectLink from '../common/link/link';
import Title from '../common/title/title';
import Input from '../common/input/input';

const Login = () => {
  return (
    <section data-testid="login" className="login-container">
      <Title />

      <Input placeholder={'Enter your email'} type={'email'} />

      <RedirectLink
        path={'/page'}
        content={<Button content={`Sign in`} className={'login-button'} />}
        linkKey={'login-link'}
      />
    </section>
  );
};

export default Login;
