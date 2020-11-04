import React from 'react';
import './home.scss';
import Button from '../common/button/button';
import RedirectLink from '../common/link/link';
import Title from '../common/title/title';

const Home = () => {
  return (
    <section data-testid="home" className="home-container">
      <Title />

      <RedirectLink
        path={'/login'}
        content={<Button content={`Sign in`} className={`home-button`} />}
        linkKey={'sign-in-link'}
      />

      <span className="home-text">or</span>

      <RedirectLink
        path={'/page'}
        content={'Create account'}
        className={'accent-link'}
        linkKey={'create-account-link'}
      />
    </section>
  );
};

export default Home;
