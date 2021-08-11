import React, { useState } from 'react';
import { useClickOutside } from '../../../utils/hooks/useClickOutside';

const Dropdown = ({ data, setSelectedOption }) => {
  const [clickStatus, setClickStatus] = useState(false);
  const [selectedValue, setSelectedValue] = useState(data.timezones[0]);

  const clickOutsideRef = useClickOutside(() => {
     setClickStatus(false);
  });

  return (
    <div className="dropdown-wrapper">
      <div
        className="dropdown"
        onClick={() => {
          setClickStatus(!clickStatus);
        }}
      >
        <div className="selected">{selectedValue}</div>
        <div className="arrow" />
      </div>
      <div className={`option-container ${!clickStatus && 'hide'}`}
           ref={clickOutsideRef}
      >
        {data.timezones.map((timezone, index) => (
          <label className="option-label" htmlFor={timezone} key={index}>
            {timezone}
            <input
              className="option"
              type="radio"
              name="timezones"
              id={timezone}
              value={timezone}
              onClick={(event) => {
                setSelectedValue(event.target.value);
                setSelectedOption(event.target.value);
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
