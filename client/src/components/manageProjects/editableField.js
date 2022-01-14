import React, { useState, useRef, useEffect } from 'react';
import '../../sass/ManageProjects.scss';
import Modal from './modal/Modal';
import { REACT_APP_CUSTOM_REQUEST_HEADER } from '../../utils/globalSettings';

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
  const headerToSend = REACT_APP_CUSTOM_REQUEST_HEADER;
  const [fieldValue, setFieldValue] = useState(fieldData);
  const [editable, setEditable] = useState(false);
  const [notRestricted, setNotRestricted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // body to be collected and sent to the Github server
  const [formattedIssue, setFormattedIssue] = useState({
    title: `Request to edit ${projectName}'s ${fieldName} field`,
    projectName: `${projectName}`,
    fieldToEdit: `${fieldName}`,
    proposedValue: '',
    assignee: 'ExperimentsInHonesty',
  });
  console.log('editableField: formattedIssue: ', formattedIssue);

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
    const newIssue = {
      ...formattedIssue,
      proposedValue: issue.proposedValue,
    };
    console.log('editableIssue: newIssue:', newIssue);
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

  const requestToEdit = async () => {
    const url = `https://api.github.com/repos/hackforla/VRMS/issues`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'x-customrequired-header': headerToSend,
        Accept: 'application/vnd.github.v3+json',
        Authorization: 'token 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',
      },
      title: formattedIssue.title,
      body: JSON.stringify(formattedIssue),
    };

    try {
      const response = await fetch(url, requestOptions);
      const resJson = await response.json();

      return resJson;
    } catch (error) {
      console.log(`update user error: `, error);
    }
  };

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
                title={`Request to edit ${projectName} project ${fieldName} field`}
                project={projectName}
                fieldToEdit={fieldName}
                handleClose={closeModal}
                getIssue={getIssue}
                requestToEdit={requestToEdit}
                setShowModal={setShowModal}
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
