import React from 'react';

const Input = ({ placeholder, type, onChange, autoComplete }) => {
  return (
    <div className="text-field-container">
      <input
        data-testid="default-input"
        type={type}
        name="default-input"
        placeholder={placeholder}
        onChange={onChange}
        autoComplete={autoComplete}
      />
    </div>
  );
};

export default Input;
