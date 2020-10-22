import React from 'react';
import { Link } from 'react-router-dom';

export default ({ path, content, className, key }) => {
  if (!className) className = '';
  if (!key) key = '';
  return (
    <Link to={path} key={key} className={`redirect-link ${className}`}>
      {content}
    </Link>
  );
};
