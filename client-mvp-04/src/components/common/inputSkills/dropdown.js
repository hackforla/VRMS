import React from 'react'
import { useClickOutside } from '../../../utils/hooks/useClickOutside';


const Dropdown = ({
  displayStatus,
  setDisplayStatus,
  onClickHandler,
  options
}) => {
  const clickOutsideRef = useClickOutside(() => {
    setDisplayStatus(false);
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
              setDisplayStatus(false);
              onClickHandler(e.target.value);
            }}
          />
        </label>
      ))}
    </div>
  );
};

export default Dropdown
