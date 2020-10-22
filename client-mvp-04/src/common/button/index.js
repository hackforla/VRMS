import React from 'react';
import './index.scss';

export default ({ content, className }) => {
  return <button className={className}>{content}</button>;
};
