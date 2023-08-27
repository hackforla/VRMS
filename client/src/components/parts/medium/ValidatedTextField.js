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
      {/* Sets text field and data (if needed) based on the whether it is as add or edit form page. */}
      {isEdit ? (
        /**
         * Edit textfield.
         * Includes
         * - handleChange - to update the input fields based on users input.
         * - value - formData that is passed from the DB to fill the input fields.
         * */
        <TextField
          error={!!errors[input.name]}
          type={input.type}
          {...register(input.name, {
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
          })}
          placeholder={input.placeholder}
          helperText={`${errors[input.name]?.message || ' '}`}
          disabled={!editMode}
        />
      ) : (
        // Add new project textfield.
        <TextField
          error={!!errors[input.name]}
          type={input.type}
          {...register(input.name, {
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
          })}
          placeholder={input.placeholder}
          helperText={`${errors[input.name]?.message || ' '}`}
        />
      )}
    </Box>
  )
}

export default ValidatedTextField;