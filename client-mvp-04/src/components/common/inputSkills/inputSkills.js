import React, { useState, useRef } from 'react';
import SkillItem from './skillItem';
import DropDown from './dropdown';
import { ReactComponent as PlusSign } from '../../../assets/images/icons/plus-sign.svg';
import { useClickOutside } from '../../../hooks/useClickOutside';


const InputSkills = ({ skillOptions }) => {
  const [skills, setSkills] = useState([]);
  const [value, setValue] = useState('');
  const [displayStatus, setDisplayStatus] = useState(false);
  const [errors, setErrors] = useState([]);
  const inputRef = useRef(null);
  const clickOutsideRef = useClickOutside(() => {
    setDisplayStatus(false);
    console.log("asdkfahlsdkjfh")
  });
  
  const removeSkill = (index) => () => {
    setSkills(skills.filter((s, i) => i !== index));
  };
  const showError = (skill) => {
    setErrors([...errors, `${skill} is not one of the options`])
  }
  const submitSkill = (e) => {
    if(value === "") return
    let skill = skillOptions.find(
      skill => (
        skill.toLowerCase().includes(value.toLowerCase())
    ));
    if (skill){
      setSkills([...skills, skill]);
    } else {
      showError(value);
      inputRef.current.focus();
      return;
    }
    setValue('');
    e.target.parentElement.classList.add('required-asterisk');
  };

  const getSkillOptions = () => (
    skillOptions.filter(skill => skill.toLowerCase().includes(value.toLowerCase()))
  );

  return (
    <div>
      {errors.map((error) => (
        <div className="error-message">{error}</div>
      ))}
      <div className="skill-input-container required-asterisk dropdown-wrapper">
        <input
          type="text"
          placeholder="   Current Skills"
          id="skill-input"
          ref={inputRef}
          onChange={(e) => {
            setValue(e.target.value);
            if (e.target.value !== '') {
              setDisplayStatus(true);
            }
            e.target.parentElement.classList.remove('required-asterisk');
          }}
          // onKeyDown={(e) => {
          //   if (e.key === 'Enter') {
          //     submitSkill(e);
          //   }
          // }}
          value={value}
        />
        <PlusSign onClick={submitSkill} className="input-plus" />
        <DropDown
          displayStatus={displayStatus}
          setDisplayStatus={setDisplayStatus}
          skillOptions={getSkillOptions()}
          setValue={setValue}
          clickOutsideRef={clickOutsideRef}
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
