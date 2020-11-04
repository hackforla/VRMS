import React from 'react';

const Input = ({ placeholder, type }) => {
  return (
    <div className="text-field-container">
      <input
        data-testid="default-input"
        type={type}
        name="default-input"
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
