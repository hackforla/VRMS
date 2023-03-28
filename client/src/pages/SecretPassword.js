import React, { useState } from 'react';
import {
  Typography,
  Box,
  TextField,
  InputLabel,
  Button,
  Grid,
} from '@mui/material';

/** Secret Ppassword Component
 *
 * To be used for validating the secret password during HFLA onboarding
 * */

const currentSecretPassword = "strawberry".toLowerCase() // must be lower case

const successMessage = "Great job! You found the secret password"
const encouragementMessage = "Now take that word and use it to follow the rest of the onboarding instructions!"
const secretInputLabel = "What's the Secret Password?"

const helperTextInitial = " "
const helperTextError = "That's not the password, please try again."
const helperTextSuccess = "That's the word!"

/** Secret Password Component
 * -renders a form for validating the secret password
 * */

export default function SecretPassword() {
  const [state, setState] = useState({
    secretPassword: '',
    error: false,
    success: false,
    copied: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    const newFormData = { ...state }
    newFormData[name] = value
    setState(newFormData);
  };

  const onSubmit = (e) => {
    e.preventDefault()
    setState((fData) => ({
      ...fData,
      "secretPassword": "",
      "error": currentSecretPassword !== state.secretPassword.toLowerCase(),
      "success": currentSecretPassword === state.secretPassword.toLowerCase(),
    }));
  }

  return (
    <Box sx={{ px: 0.5 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h1">Secret Password</Typography>
      </Box>
      <Box>
        <Box sx={{ py: 2, px: 4 }}>
          {!state.success && (
            <form id="secret-password">
              <Box sx={{ mb: 1 }}>
                <Grid container alignItems="center">
                  <Grid item xs="auto" sx={{ pr: 3 }}>
                    <InputLabel
                      sx={{ width: 'max-content', ml: 0.5, mb: 0.5 }}
                      id="secretPassword"
                    >
                      {secretInputLabel}
                    </InputLabel>
                  </Grid>
                </Grid>

                <TextField
                  id="secretPassword"
                  name="secretPassword"
                  placeholder="Enter the secret password"
                  variant="outlined"
                  type="text"
                  onChange={handleChange}
                  color={state.success ? "success" : ""}
                  helperText={
                    state.success
                      ? helperTextSuccess // This component should be hidden if this state is active ( state.success === true )
                      : !state.error
                        ? helperTextInitial
                        : helperTextError}
                  error={state.error}
                  value={state["secretPassword"]}
                />
              </Box>
              <Button
                sx={{ minWidth: 150 }}
                form="secret-password"
                variant='contained'
                type='submit'
                onClick={(e) => { onSubmit(e) }}
              >
                Submit
              </Button>
            </form>
          )}
        </Box>
      </Box>

      {state.success && (
        <Box>
          <Grid container justifyContent="center">
            <Typography variant='p' sx={{ mx: 5, mt: 4 }}>{successMessage}:
            </Typography>
            <Box color='success.main'>
              <Typography variant='p' sx={{ mx: 5, mt: 4, fontWeight: 800 }}>
                {currentSecretPassword}
              </Typography>
            </Box>
            <Typography variant='p' sx={{ mx: 5, mt: 4 }}>{encouragementMessage}</Typography>
            <Grid item xs="auto">
              <Button
                sx={{ minWidth: 150 }}
                form="secret-password"
                variant='contained'
                color="success"
                onClick={(e) => {
                  navigator.clipboard.writeText(currentSecretPassword);
                  setState((fData) => ({
                    ...fData,
                    "copied": true,
                  }));
                }}
              >
                {!state.copied ? "Click to Copy" : "Copied!"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}
