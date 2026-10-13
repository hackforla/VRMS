import React from 'react';
import { Box, Button, FormControl, TextField, Typography } from '@mui/material';

const ReturnUserForm = (props) => {
  return (
    <Box className="check-in-container">
      <Box className="check-in-headers">
        <Typography
          variant="h3"
          component="h3"
          style={{ fontSize: 40, fontWeight: 'bold', marginBottom: 18 }}
        >
          WELCOME BACK!
        </Typography>
      </Box>
      <Box className="check-in-form">
        <FormControl
          autoComplete
          className="form-check-in"
          onSubmit={(e) => e.preventDefault()}
        >
          <Box className="form-row">
            <Box className="form-input-text">
              <Typography style={{ marginBottom: 30 }}>
                Which email address did you use to check-in last time?
              </Typography>
              <TextField
                label="Enter your email address:"
                type="email"
                name="email"
                placeholder="Email Address"
                required="required"
                value={props.formInput.email.toString().toLowerCase()}
                onChange={props.handleInputChange}
                aria-label="Email Address"
                data-test="input-email"
                autoComplete="email"
              />
            </Box>
            <Typography
              style={{
                fontStyle: 'italic',
                fontSize: 10,
                fontWeight: 'normal',
                marginTop: 5,
              }}
            >
              {"(This allows easy use of the app. We'll never sell your data!)"}
            </Typography>
          </Box>

          {props.isError && props.errorMessage.length > 1 && (
            <Box className="error">{props.errorMessage}</Box>
          )}

          {props.user === false && (
            <Box className="error">Try entering your email again.</Box>
          )}

          {!props.user && !props.isLoading ? (
            <Box className="form-row">
              <Box className="form-input-button">
                <Button
                  type="submit"
                  className="form-check-in-submit"
                  onClick={(e) => props.checkEmail(e)}
                  disabled={
                    !props.formInput.email || props.formInput.email === ''
                  }
                >
                  CHECK IN
                </Button>
              </Box>
            </Box>
          ) : (
            <Box className="form-row">
              <Box className="form-input-button">
                <Button
                  type="submit"
                  className="form-check-in-submit block"
                  onClick={(e) => e.preventDefault()}
                >
                  CHECKING IN...
                </Button>
              </Box>
            </Box>
          )}
        </FormControl>
      </Box>
    </Box>
  );
};
export default ReturnUserForm;
