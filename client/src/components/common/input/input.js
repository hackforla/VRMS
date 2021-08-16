import React from 'react';

const Input = ({ placeholder, type, onChange, autoComplete, dataTestid }) => {
  if (!dataTestid) dataTestid = 'default-input';
  return (
    <div className="text-field-container">
      <input
        data-testid={dataTestid}
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
