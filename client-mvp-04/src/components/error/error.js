import React from 'react';
import './error.scss';
import RedirectLink from '../common/link/link';

const Error = () => {
  return (
    <section data-testid="error" className="flex-container error">
      <span className="error-status">404</span>
      <h2 className="error-content">Oops! Page not found!</h2>
      <RedirectLink
        linkKey={'error-home'}
        path={'/'}
        className={'accent-link'}
        content={'Go to Homepage'}
      />
    </section>
  );
};

export default Error;
