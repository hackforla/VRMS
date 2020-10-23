import React from 'react';
import './index.scss';
import RedirectLink from '../common/link';

const Error = () => {
  return (
    <section className="error-container">
      <span className="error-status">404</span>
      <h2 className="error-content">Oops! Page not found!</h2>
      <RedirectLink
        linkKey={'error-home'}
        path={'/'}
        className={'redirect-link'}
        content={'Back to Homepage'}
      />
    </section>
  );
};

export default Error;
