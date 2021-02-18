import React, { useState } from 'react';

const Checkbox = ({ content, className, dataTestid }) => {
  const [isChecked, setChecked] = useState(false);

  if (!dataTestid) dataTestid = 'checkbox';

  const toggleCheck = () => {
    setChecked(!isChecked);
  };

  return (
    <span onClick={toggleCheck}>
      <input
        type="checkbox"
        data-testid={dataTestid}
        className={className}
        checked={isChecked}
        onChange={() => isChecked}
        value={content}
      />
      <span />
      {content}
    </span>
  );
};

export default Checkbox;
