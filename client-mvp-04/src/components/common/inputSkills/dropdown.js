import React from 'react'

const Dropdown = ({
  displayStatus,
  setDisplayStatus,
  setValue,
  skillOptions,
  clickOutsideRef,
}) => {
  return (
    <div
      className={`option-container ${!displayStatus && 'hide'}`}
      ref={clickOutsideRef}
    >
      {skillOptions.map((skill, index) => (
        <label className="option-label" htmlFor={skill} key={index}>
          {skill}
          <input
            className="option"
            type="radio"
            name="skills"
            id={skill}
            value={skill}
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
