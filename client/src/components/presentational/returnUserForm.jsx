import React from 'react';
import { Box, Button, FormControl, Input, Typography } from '@mui/material';

const ReturnUserForm = (props) => {
  return (
    <Box className="check-in-container">
      <Box className="check-in-headers">
        {/* This styling serves as a temporary default for UI/UX team. */}
        <Typography variant='h3' component='h3' style={{ fontSize: 40, fontWeight: 'bold' }}>WELCOME BACK!</Typography>
      </Box>
      <Box className="check-in-form">
        <FormControl
          autoComplete
          className="form-check-in"
          onSubmit={(e) => e.preventDefault()}
        >
          <Box className="form-row">
            <Box className="form-input-text">
              {/* Typography seems to work better than MUI InputLabel in this instance; again, just a placeholder for UI/UX team. */}
              <Typography>
                Which email address did you use to check-in last time?
              </Typography>
              <Input
                type="email"
                name="email"
                placeholder="Email Address"
                value={props.formInput.email.toString()}
                onChange={props.handleInputChange}
                aria-label="Email Address"
                required
                autoComplete="email"
              />
            </Box>
            <Typography>
              {"(This allows easy use of the app. We'll never sell your data!)"}
            </Typography>
          </Box>

          {props.isError && props.errorMessage.length > 1 &&
            <Box className="error">{props.errorMessage}</Box>
          }
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
