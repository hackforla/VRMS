import React from 'react';
import { Box, Grid, InputLabel, TextField } from "@mui/material";

function ValidatedTextField({
  register,
  errors,
  isEdit,
  editMode,
  locationType,
  locationRadios,
  input,
}) {
  const registerObj = {
    ...register(input.name, {
    required: `${input.name} is required`,
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
    }
  )}

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
      disabled={isEdit ? !editMode : undefined} // handles edit mode for EditProjcet form
    />
  </Box>
  );
};

export default ValidatedTextField;