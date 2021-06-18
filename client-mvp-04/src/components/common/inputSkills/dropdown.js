import React from 'react'
import { useClickOutside } from '../../../hooks/useClickOutside';


const Dropdown = ({
  displayStatus,
  setDisplayStatus,
  setValue,
  options
}) => {
  const clickOutsideRef = useClickOutside(() => {
    setDisplayStatus(false);
    console.log('asdkfahlsdkjfh');
  });
  return (
    <div
      className={`option-container ${!displayStatus && 'hide'}`}
      ref={clickOutsideRef}
    >
      {options.map((option, index) => (
        <label className="option-label" htmlFor={option} key={index}>
          {option}
          <input
            className="option"
            type="radio"
            name="options"
            id={option}
            value={option}
            onClick={(e) => {
              setValue(e.target.value);
              setDisplayStatus(!displayStatus);
            }}
          />
        </label>
      ))}
    </div>
  );
};

export default Dropdown
