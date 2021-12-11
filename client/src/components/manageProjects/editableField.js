import React, { useState, useRef, useEffect } from 'react';
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
}) => {
  const [fieldValue, setFieldValue] = useState(fieldData);
  const [editable, setEditable] = useState(false);
  const [userAccessLevel] = useState(accessLevel);
  const [userCanEdit, setUserCanEdit] = useState(false);
  const ref = useRef();

  console.log('editableField: props: editable:', editable);
  console.log('editableFields: props: accessLevel: ', userAccessLevel);
  console.log('editableFields: props: accessLevel: ', accessLevel);
  console.log('usercanedit', userCanEdit);

  // create function that checks the user has access to edit all fields

  const canEdit = () => {
    // get user accessLevel
    console.log(
      `editableField: canEdit: activated onClick: editable?: ${editable} : and accessLevel: ${accessLevel}`
    );

    if (userAccessLevel === 'user') {
      setUserCanEdit(true);
    }
  };

  // Update the displayed results to match the change just made to the db
  useEffect(() => {
    canEdit();
    if (editable) {
      ref.current.focus();
      setFieldValue(fieldData);
    }
  }, [editable, userCanEdit]);

  return (
    // here goes the conditional rendering
    // this button will be disabled if user !admin
    <div>
      <div>
        {fieldTitle}
        {userCanEdit === true ? (
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
            [only certain users can edit this field]
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
