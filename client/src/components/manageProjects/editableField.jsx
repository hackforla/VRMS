import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, TextareaAutosize, TextField } from '@mui/material';
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
    <Box className="editable-field-div">
      <Box className="project-edit-title">
        {fieldTitle}
        {notRestricted &&
          <Button
            type="button"
            className="project-edit-button"
            onClick={() => {
              setEditable(true);
            }}
          >
            [edit]
          </Button>
        }
      </Box>

      {editable ? (
        <>
          {fieldType === 'textarea' ? (
            /* eslint-disable react/jsx-props-no-spreading */
            <TextareaAutosize {...inputProps} />
          ) : (
            <TextField {...inputProps} />
            /* eslint-enable react/jsx-props-no-spreading */
          )}
        </>
      ) : (
        <Box className="section-content">{fieldData}</Box>
      )}
    </Box>
  );
};

export default EditableField;
