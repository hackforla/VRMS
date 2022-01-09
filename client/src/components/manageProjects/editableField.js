import React, { useState, useRef, useEffect } from 'react';
import '../../sass/ManageProjects.scss';
import Modal from './Modal';

const EditableField = ({
  projId,
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
  const ref = useRef();

  // Modal Functions
  console.log('editableField: showModal:', showModal);
  const closeModal = (e) => {
    setShowModal(false);
    console.log(showModal);
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
              {/* Modal will go here. onclick => open modal */}
              {/* Propose this text gets changed to a call to action type of text and something that better describes what happens when the link is clicked  */}
              {/* "Click here to..." */}
              [Contact your team lead to make changes to this field]
            </span>

            {showModal ? <Modal handleClose={closeModal} /> : null}
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
