import React, { useState } from 'react';

const Checkbox = ({ content, className, dataTestid }) => {
  const [isChecked, setChecked] = useState(false);

  if (!dataTestid) dataTestid = 'checkbox';

  const toggleCheck = () => {
    setChecked(!isChecked);
  };

  return (
    <div onClick={toggleCheck} className="checkbox-wrapper">
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
    </div>
  );
};

export default Checkbox;
