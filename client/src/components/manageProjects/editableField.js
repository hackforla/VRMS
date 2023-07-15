import React, { useState, useRef, useEffect } from 'react';
import '../../sass/ManageProjects.scss';

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
      if (!validateEditableField(fieldName, fieldValue)) {
        alert(`Invalid field value for ${fieldName}`);
        console.log(fieldValue);
        return;
      }
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
        {notRestricted && (
          <button
            type="button"
            className="project-edit-button"
            onClick={() => {
              setEditable(true);
            }}
          >
            [edit]
          </button>
        )}
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
        <div className="section-content">{fieldData}</div>
      )}
    </div>
  );
};

const validateEditableField = (fieldName, fieldValue) => {
  switch (fieldName) {
    case 'hflaWebsiteUrl':
      return doesLinkContainFlex(fieldValue, 'hackforla.org');
    case 'slackUrl':
      return doesLinkContainFlex(fieldValue, 'slack.com');
    case 'googleDriveUrl':
      return doesLinkContainFlex(fieldValue, 'drive.google.com');
    case 'githubUrl':
      return doesLinkContainFlex(fieldValue, 'github.com');
    default:
      break;
  }
};

const doesLinkContainFlex = (link, key) => {
  if (link.startsWith(`https://${key}`)) return true;
  if (link.startsWith(`https://www.${key}`)) return true;
  if (link.startsWith(key)) return true;
  return false;
}

export default EditableField;
