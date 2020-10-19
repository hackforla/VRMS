import React from 'react';
import './index.scss';

const Main = () => {
  return (
    <main className="app-main">
      <div className="app-name">VRMS</div>
      <h1 className="app-title">Volunteer Relationship Management System</h1>
      <button className="main-button">Sign in</button>
      <span className="main-text">or</span>
      <div className="main-link">create account</div>
    </main>
  );
};

export default Main;
