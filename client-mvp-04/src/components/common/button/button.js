import React from 'react';
import './button.scss';

const Button = ({
  content,
  className,
  disabled,
  onClick,
  type,
  dataTestid,
}) => {
  if (!dataTestid) dataTestid = 'button';
  return (
    <button
      data-testid={dataTestid}
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
