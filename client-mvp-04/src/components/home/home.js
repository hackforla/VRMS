import React from 'react';
import './home.scss';
import Button from '../common/button/button';
import RedirectLink from '../common/link/link';

const Home = () => {
  return (
    <section data-testid="home" className="home-container">
      <h1 className="home-name">VRMS</h1>
      <h2 className="home-title">Volunteer Relationship Management System</h2>

      <RedirectLink
        path={'/page'}
        content={<Button content={`Sign in`} className={`home-button`} />}
        linkKey={'sign-in-link'}
      />

      <span className="home-text">or</span>

      <RedirectLink
        path={'/register'}
        content={'Create account'}
        className={'accent-link'}
        linkKey={'create-account-link'}
      />
    </section>
  );
};

export default Home;
