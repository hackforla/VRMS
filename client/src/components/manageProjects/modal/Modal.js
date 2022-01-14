import React, { useState } from 'react';
import '../../../sass/Modal.scss';
import { Label, Input, AuxiliaryButton } from '../../Form';

const Modal = (props) => {
  // console.log('Modal.js: props: ', props);
  const [issue, setIssue] = useState({ proposedValue: '' });
  // console.log('Modal: issue: ', issue);

  const handleChange = (e) => {
    setIssue({ [e.target.name]: e.target.value });
  };

  const handleCancel = (e) => {
    setIssue({ proposedValue: '' });
    props.setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.getIssue(issue);
    setIssue({ proposedValue: '' });
    // this handle close cannot go here
    // props.handleClose(e);

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
                console.log(res);
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
