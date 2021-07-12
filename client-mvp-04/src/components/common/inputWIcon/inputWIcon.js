import React from 'react'
import gitHubIcon from "../../../assets/images/icons/github.png";

const InputWIcon = () => {
  return (
    <div>
      <div className="text-field-icon-container">
        <label htmlFor="text-icon-field">
          <img src={gitHubIcon} className="text-field-icon" alt="gitHub"/>
        </label>
        <input
          type="text"
          name="text-icon-field"
          id="text-icon-field"
          placeholder="GitHub user name" /* max_length:22*/
        />
      </div>
      <p className="dev-comment">Input with icon</p>
    </div>
  )
}


export default InputWIcon