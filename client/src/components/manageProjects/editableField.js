import React, { useState, useRef, useEffect } from 'react';
import '../../sass/ManageProjects.scss';
import Modal from './Modal';

const EditableField = ({
  projId,
  projectName,
  fieldData,
  fieldName,
  updateProject,
  renderUpdatedProj,
  fieldType,
  fieldTitle,
  accessLevel,
  canEdit,
}) => {
  const [fieldValue, setFieldValue] = useState(fieldData);
  const [editable, setEditable] = useState(false);
  const [notRestricted, setNotRestricted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // body to be collected and sent to the Github server
  const [formattedIssue, setFormattedIssue] = useState({
    title: 'Request to edit project field',
    projectName: projectName,
    fieldToEdit: fieldName,
    proposedValue: '',
    assignee: 'ExperimentsInHonesty',
  });

  const ref = useRef();

  // Modal Functions

  const closeModal = (e) => {
    setFormattedIssue({
      ...formattedIssue,
      proposedValue: '',
    });
    setShowModal(false);
  };

  const getIssue = (issue) => {
    console.log('value', issue);
    const newIssue = {
      ...formattedIssue,
      proposedValue: issue.proposedValue,
    };
    setFormattedIssue(newIssue);
  };

  // create function that checks the user has access to edit all fields
  const checkUser = () => {
    const permitted = canEdit.includes(accessLevel);
    setNotRestricted(permitted);
  };

  // Update the displayed results to match the change just made to the db
  useEffect(() => {
    checkUser();
    if (editable) {
      ref.current.focus();
      setFieldValue(fieldData);
    }
  }, [editable]);

  return (
    // here goes the conditional rendering
    // this button will be disabled if user !admin
    <div>
      <div>
        {fieldTitle}
        {notRestricted ? (
          <span
            className="project-edit-button"
            onClick={() => {
              setEditable(true);
            }}
          >
            {' '}
            [edit]
          </span>
        ) : (
          <>
            <span
              className="project-edit-button"
              style={{ color: 'gray' }}
              onClick={() => setShowModal(true)}
            >
              {' '}
              [Contact your team lead to make changes to this field]
            </span>
            {/* Modal will go here. onclick => open modal */}
            {/* Propose this text gets changed to a call to action type of text and something that better describes what happens when the link is clicked  */}
            {/* "Click here to..." */}

            {showModal ? (
              <Modal
                title={`Request to edit ${projectName} project ${fieldName}field`}
                project={projectName}
                fieldToEdit={fieldName}
                handleClose={closeModal}
                getIssue={getIssue}
              />
            ) : null}
          </>
        )}
      </div>

      {editable ? (
        fieldType === 'textarea' ? (
          <textarea
            ref={ref}
            className="editable-field"
            onBlur={(e) => {
              updateProject(projId, fieldName, fieldValue).then((proj) => {
                renderUpdatedProj(proj);
                setEditable(false);
              });
            }}
            onChange={(e) => {
              setFieldValue(e.target.value);
              const input = e.target;
              const onEnterKey = (e) => {
                if (e.keyCode === 13) {
                  input.removeEventListener('keydown', onEnterKey);
                  input.blur();
                }
              };
              input.addEventListener('keydown', onEnterKey);
            }}
          >
            {fieldValue}
          </textarea>
        ) : (
          <input
            ref={ref}
            type="text"
            className="editable-field"
            value={fieldValue}
            onBlur={(e) => {
              updateProject(projId, fieldName, fieldValue).then((proj) => {
                renderUpdatedProj(proj);
                setEditable(false);
              });
            }}
            onChange={(e) => {
              setFieldValue(e.target.value);
              const input = e.target;
              const onEnterKey = (e) => {
                if (e.keyCode === 13) {
                  input.removeEventListener('keydown', onEnterKey);
                  input.blur();
                }
              };
              input.addEventListener('keydown', onEnterKey);
            }}
          />
        )
      ) : (
        <div className="section-content">{fieldData}</div>
      )}
    </div>
  );
};

export default EditableField;
