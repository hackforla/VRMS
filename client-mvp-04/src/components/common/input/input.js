import React from 'react';

const Input = ({ placeholder, type, onChange, autoComplete, dataTestid, value }) => {
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
        value={value}
      />
    </div>
  );
};

export default Input;
