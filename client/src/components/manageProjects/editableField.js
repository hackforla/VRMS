import React, { useState, useRef, useEffect } from 'react';
import '../../sass/ManageProjects.scss';
import EditIcon from '../svg/EditIcon';
// client/src/components/svg/EditIcon.jsx

const EditableField = ({
  fieldData,
  fieldName,
  updateProject,
  fieldType = 'text',
  fieldTitle,
  accessLevel,
  canEdit = ['admin'],
}) => {
  const [fieldValue, setFieldValue] = useState(fieldData);
  const [editable, setEditable] = useState(false);
  const [notRestricted] = useState(canEdit.includes(accessLevel));
  const ref = useRef();

  // Update the displayed results to match the change just made to the db
  useEffect(() => {
    if (editable) {
      ref.current.focus();
    }
  }, [editable]);

  const inputProps = {
    ref,
    className: 'editable-field',
    onBlur: () => {
      setEditable(false);
      updateProject(fieldName, fieldValue);
    },
    onChange: ({ target }) => {
      setFieldValue(target.value);
      const onEnterKey = ({ keyCode }) => {
        if (keyCode === 13) {
          target.removeEventListener('keydown', onEnterKey);
          target.blur();
        }
      };
      target.addEventListener('keydown', onEnterKey);
    },
    value: fieldValue,
  };

  return (
    // this button will be disabled if user !admin
    <div className="editable-field-div">
      <div className="project-edit-title">
        {fieldTitle}
        {notRestricted &&
          <button
            type="button"
            className="project-edit-button"
            onClick={() => {
              setEditable(true);
            }}
          >
            <EditIcon /> <span>Edit</span>
          </button>
        }
      </div>

      {editable ? (
        <>
          {fieldType === 'textarea' ? (
            /* eslint-disable react/jsx-props-no-spreading */
            <textarea {...inputProps} />
          ) : (
            <input {...inputProps} />
            /* eslint-enable react/jsx-props-no-spreading */
          )}
        </>
      ) : (
        <div className="section-content">{fieldData || "{ none }"}</div>
      )}
    </div>
  );
};

export default EditableField;
