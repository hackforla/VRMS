import React from 'react';
import { Link } from 'react-router-dom';

const RedirectLink = ({ path, content, className, linkKey, dataTestid }) => {
  if (!className) className = '';
  if (!dataTestid) dataTestid = 'link';
  return (
    <Link
      data-testid={dataTestid}
      to={path}
      key={linkKey}
      className={`redirect-link ${className}`}
    >
      {content}
    </Link>
  );
};

export default RedirectLink;
