import React from 'react';
import './button.scss';

const Button = ({ content, className, disabled, onClick, type }) => {
  return (
    <button
      data-testid="button"
      className={className}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export default Button;
