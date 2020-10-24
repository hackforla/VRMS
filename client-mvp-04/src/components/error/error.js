import React from 'react';
import './error.scss';
import RedirectLink from '../common/link/link';

const Error = () => {
  return (
    <section data-testid="error" className="error-container">
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
