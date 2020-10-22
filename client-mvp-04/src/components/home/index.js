import React from 'react';
import './index.scss';
import Button from '../../common/button';
import RedirectLink from '../../common/link';

const Home = () => {
  return (
    <section className="home-container">
      <h1 className="home-name">VRMS</h1>
      <h2 className="home-title">Volunteer Relationship Management System</h2>

      <RedirectLink
        path={'/page'}
        content={<Button content={`Sign in`} className={`home-button`} />}
      />

      <span className="home-text">or</span>

      <RedirectLink
        path={'/page'}
        content={'create account'}
        className={'home-link'}
      />
    </section>
  );
};

export default Home;
