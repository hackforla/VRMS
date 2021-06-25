import React, { useState, useRef } from 'react';
import SkillItem from './skillItem';
import DropDown from './dropdown';
import { ReactComponent as PlusSign } from '../../../assets/images/icons/plus-sign.svg';

const InputSkills = ({ options, skills, setSkills }) => {
  const [skillOptions, setSkillOptions] = useState(options);
  const [value, setValue] = useState('');
  const [displayStatus, setDisplayStatus] = useState(false);
  const [errors, setErrors] = useState([]);
  const inputRef = useRef(null);
  const skillWrapperRef = useRef(null);
  
  
  const removeSkill = (index) => () => {
    setSkillOptions([...skillOptions, skills[index]])
    setSkills(skills.filter((s, i) => i !== index));
    setTimeout(() => {
      if(skills.length <= 1) {
        skillWrapperRef.current.classList.add("required-asterisk")
      }
    }, 100)
  };
  const showError = (skill) => {
    setErrors([
      `${skill} is not a valid input. Please select from the dropdown list.`
    ]);
  }
  const dropDownOptionClicked = clickedValue => {
    setValue(clickedValue);
    inputRef.current.focus();
  }
  const submitSkill = (e) => {
    if(value === "") return
    let skill = skillOptions.find(
      skill => (
        skill.toLowerCase() === value.toLowerCase())
    );
    setErrors([]); // clears errors
    if (skill){
      if(!skills.includes(skill)){
        setSkills([...skills, skill]);
        setSkillOptions(skillOptions.filter(s => s !== skill));
      }
    } else {
      showError(value);
      inputRef.current.focus();
      return;
    }
    setValue('');
    skillWrapperRef.current.classList.remove('required-asterisk');
  };

  const getSkillOptions = () => (
    skillOptions.filter(skill => skill.toLowerCase().startsWith(value.toLowerCase()))
  );

  return (
    <div>
      {errors.map((error) => (
        <div className="error-message">{error}</div>
      ))}
      <div 
        className="skill-input-container required-asterisk dropdown-wrapper"
        ref={skillWrapperRef}
      >
        <input
          type="text"
          placeholder=" Current Skills"
          id="skill-input"
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              submitSkill(e);
            }
          }}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (e.target.value !== '') {
              setDisplayStatus(true);
            }
          }}
          onFocus={() =>
            setDisplayStatus(true)
          }
        />
        <PlusSign onClick={submitSkill} className="input-plus" />
        <DropDown
          displayStatus={displayStatus}
          setDisplayStatus={setDisplayStatus}
          options={getSkillOptions()}
          onClickHandler={dropDownOptionClicked}
        />

        <div className="skills-container">
          {skills.map((skill, index) => (
            <SkillItem
              key={index}
              skill={skill}
              index={index}
              remove={removeSkill(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InputSkills;
