import React, { useCallback, useState, useRef, useEffect } from 'react';
import '../../sass/ManageProjects.scss';

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
  const ref = useRef();

  // create function that checks the user has access to edit all fields

  const checkUser = useCallback(() => {
    const permitted = canEdit.includes(accessLevel);
    setNotRestricted(permitted);
  }, [accessLevel, canEdit]);

  // Update the displayed results to match the change just made to the db
  useEffect(() => {
    checkUser();
    if (editable) {
      ref.current.focus();
      setFieldValue(fieldData);
    }
  }, [checkUser, editable, fieldData]);

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
          <span className="project-edit-button" style={{ color: 'gray' }}>
            {' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/hackforla/VRMS/blob/development/team-lead-contact-info.md"
            >
              [Click here to find out how to change this field]
            </a>
          </span>
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
