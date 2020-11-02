import React from 'react';
import './button.scss';

const Button = ({ content, className }) => {
  return (
    <button data-testid="button" className={className}>
      {content}
    </button>
  );
};

export default Button;
