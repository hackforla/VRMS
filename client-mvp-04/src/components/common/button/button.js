import React from 'react';
import './button.scss';

const Button = ({ content, className, onClick, disabled }) => {
  return (
    <button data-testid="button" className={className} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
};

export default Button;
