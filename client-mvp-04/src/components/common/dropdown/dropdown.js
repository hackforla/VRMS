import React, { useState } from 'react';

const Dropdown = ({ data, setTimezone }) => {
  const [clickStatus, setClickStatus] = useState(false);
  const [selectedValue, setSelectedValue] = useState(data.timezones[0]);
  return (
    <div className={'dropdown-wrapper'}>
      <div
        className={'dropdown'}
        onClick={() => {
          setClickStatus(!clickStatus);
        }}
      >
        <div className={'selected'}>{selectedValue}</div>
        <div className={'arrow'}></div>
      </div>
      <div className={`option-container ${!clickStatus ? 'hide' : ''}`}>
        {data.timezones.map((timezone, index) => (
          <label className={'option-label'} htmlFor={timezone} key={index}>
            {timezone}
            <input
              className={'option'}
              type="radio"
              name="timezones"
              id={timezone}
              value={timezone}
              onClick={(event) => {
                setSelectedValue(event.target.value);
                setTimezone(event.target.value);
                setClickStatus(!clickStatus);
              }}
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
