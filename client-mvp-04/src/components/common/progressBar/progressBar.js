import React from 'react';

const ProgressBar = ({ total, active }) => {
  let items = new Array(total).fill(0);
  if (active > items.length) active = items.length;

  return (
    <div className="progress-bar-container" data-testid="progress-bar">
      {items.map((item, index) => (
        <span
          className={index < active ? 'progress-item active' : 'progress-item'}
          key={index}
          data-testid="progress-item"
        />
      ))}
    </div>
  );
};

export default ProgressBar;
