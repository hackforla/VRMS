import React from 'react';
import { Link } from 'react-router-dom';

const RedirectLink = ({ path, content, className, linkKey }) => {
  if (!className) className = '';
  return (
    <Link
      data-testid="link"
      to={path}
      key={linkKey}
      className={`redirect-link ${className}`}
    >
      {content}
    </Link>
  );
};

export default RedirectLink;
