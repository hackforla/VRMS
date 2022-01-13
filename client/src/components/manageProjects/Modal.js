import React, { useState } from 'react';
import { Label, Input, AuxiliaryButton } from '../../components/Form';

const Modal = (props) => {
  const [issue, setIssue] = useState({ proposedValue: '' });
  console.log('Modal.js: issue: ', issue);

  const handleChange = (e) => {
    setIssue({ [e.target.name]: e.target.value });
  };

  const handleCancel = (e) => {
    setIssue({ proposedValue: '' });
    props.handleClose(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.getIssue(issue);
    setIssue({ proposedValue: '' });
  };

  return (
    <div>
      <div>
        <div onClick={props.handleClose}>Close [X]</div>
        <p>Title: {props.title}</p>
        <p>Project Name: {props.project}</p>
        <p>Field to Edit: {props.fieldToEdit}</p>
        <form onSubmit={handleSubmit}>
          <Label>Proposed Value:</Label>
          <Input
            type="text"
            id="proposedValue"
            name="proposedValue"
            value={issue.proposedValue}
            onChange={handleChange}
          />

          <AuxiliaryButton onClick={handleCancel}>Cancel</AuxiliaryButton>
          <AuxiliaryButton type="submit">Submit</AuxiliaryButton>
        </form>
      </div>
    </div>
  );
};

export default Modal;
