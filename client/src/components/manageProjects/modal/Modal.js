import React, { useState } from 'react';
import '../../../sass/Modal.scss';
import { Label, Input, AuxiliaryButton } from '../../Form';

const Modal = (props) => {
  const [issue, setIssue] = useState({ proposedValue: '' });
  console.log('issue when it renders: ', issue);

  const handleChange = (e) => {
    console.log('issue before change: ', issue);
    setIssue({ [e.target.name]: e.target.value });
  };

  const handleCancel = (e) => {
    setIssue({ proposedValue: '' });
    props.setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.getIssue(issue);
    console.log('issue en el handleSubmit: ', issue);
    props.setShowModal(false);
  };

  return (
    <div className="container--Modal" onClick={() => props.handleClose()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="close-x" onClick={props.handleClose}>
          Close [X]
        </div>
        <p className="Label title">{props.title}</p>
        <p className="Label">Project Name: {props.project}</p>
        <p className="Label">Field to Edit: {props.fieldToEdit}</p>
        <form
          onSubmit={(e) => {
            handleSubmit(e);
            props
              .requestToEdit()
              .then((res) => {
                console.log('response', res);
              })
              .catch((err) => console.log(err));
          }}
        >
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
