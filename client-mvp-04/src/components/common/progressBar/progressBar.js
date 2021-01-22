import React from 'react';

const ProgressBar = ({ total, active }) => {
  let items = new Array(total).fill(0);

  return (
    <div className="progress-bar-container">
      {items.map((item, index) => (
        <span
          className={index < active ? 'progress-item active' : 'progress-item'}
          key={index}
        />
      ))}
    </div>
  );
};

export default ProgressBar;
