import React from 'react';
import RedirectLink from '../common/link/link';

const ExpiredAuthSessionPage = () => {
  return (
    <div className="flex-container">
      <h3 className="center">Sorry, your session is expired</h3>
      <RedirectLink
        linkKey={'auth-link'}
        path={'/login'}
        className={'accent-link'}
        content={'Login'}
      />
    </div>
  );
};

export default ExpiredAuthSessionPage;
