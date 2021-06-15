import React from 'react'
import { ReactComponent as PlusSign } from '../../../assets/images/icons/plus-sign.svg';

const SkillItem = ({ skill, remove }) => {
    return (
      <div className="skill-item">
        <span> {skill} </span> 
        <span className="skill-item-X-btn" onClick={remove}><PlusSign /></span>
      </div>
    );
}

export default SkillItem