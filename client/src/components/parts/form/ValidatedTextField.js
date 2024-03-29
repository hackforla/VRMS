import React from 'react';
import { Box, Grid, InputLabel, TextField } from "@mui/material";

/**
 * A validated text field component for forms.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.register - Function used for registering the input field with react-hook-form.
 * @param {Object} props.errors - Object containing form validation errors.
 * @param {boolean} props.isEdit - Boolean indicating if the form is in edit mode.
 * @param {boolean} props.editMode - Boolean indicating if the component is in edit mode.
 * @param {string} props.locationType - The type of location.
 * @param {ReactNode} props.locationRadios - Radio Buttons for selecting location type.
 * @param {Object} props.input - The input configuration for the text field.
 * @returns {ReactElement} The rendered component.
 */
function ValidatedTextField({
  register,
  errors,
  isEdit,
  editMode,
  locationType,
  locationRadios,
  input,
}) {
  const inputObj = {
    pattern:
      input.name === 'location'
        ? locationType === 'remote'
          ? {
              value: input.value,
              message: input.errorMessage,
            }
          : {
              value: input.addressValue,
              message: input.addressError,
            }
        : { value: input.value, message: input.errorMessage },
  };
  if ('required' in input && input.required === false) {
    // if required is set to false, don't add required attribute to object
  } else {
    inputObj.required = `${input.name} is required`;
  }
  const registerObj = {
    ...register(input.name, inputObj),
  }

  return (
  <Box sx={{ mb: 1 }} key={input.name}>
    <Grid container alignItems="center">
      <Grid item xs="auto" sx={{ pr: 3 }}>
        <InputLabel
          sx={{ width: 'max-content', ml: 0.5, mb: 0.5 }}
          id={input.name}
        >
          {input.label}
        </InputLabel>
      </Grid>
      {input.name === 'location' && locationRadios}
    </Grid>
    <TextField
      {...registerObj}
      error={!!errors[input.name]}
      type={input.type}
      placeholder={input.placeholder}
      helperText={`${errors[input.name]?.message || ' '}`}
      disabled={isEdit ? !editMode || input.disabled : undefined} // handles edit mode for EditProjcet form
    />
  </Box>
  );
};

export default ValidatedTextField;