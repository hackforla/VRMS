import React from 'react';
import './index.scss';
import { Link } from 'react-router-dom';

const Error = () => {
  return (
    <section className="error-container">
      <span className="error-status">404</span>
      <h2 className="error-content">Oops! Page not found!</h2>
      <Link key={'error-home'} to={'/'} className="redirect-link">
        Back to Homepage
      </Link>
    </section>
  );
};

export default Error;
