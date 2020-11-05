import React from 'react';
import './button.scss';

const Button = ({ content, className, disabled, onClick }) => {
  return (
    <button
      data-testid="button"
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export default Button;
