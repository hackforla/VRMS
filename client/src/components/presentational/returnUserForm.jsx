import React from 'react';
import { Box } from '@mui/material';

const ReturnUserForm = (props) => {
  return (
    <Box className="check-in-container">
      <Box className="check-in-headers">
        <Typography variant="h3">Welcome back!</Typography>
      </Box>
      <Box className="check-in-form">
        <form
          className="form-check-in"
          autoComplete="on"
          onSubmit={(e) => e.preventDefault()}
        >
          <Box className="form-row">
            <Box className="form-input-text">
              <label htmlFor="email">
                Which email address did you use to check-in last time?
              </label>
              <input
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
            <p>
              {"(This allows easy use of the app. We'll never sell your data!)"}
            </p>
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
                <button
                  type="submit"
                  className="form-check-in-submit"
                  onClick={(e) => props.checkEmail(e)}
                  disabled={
                    !props.formInput.email || props.formInput.email === ''
                  }
                >
                  CHECK IN
                </button>
              </Box>
            </Box>
          ) : (
            <Box className="form-row">
              <Box className="form-input-button">
                <button
                  type="submit"
                  className="form-check-in-submit block"
                  onClick={(e) => e.preventDefault()}
                >
                  CHECKING IN...
                </button>
              </Box>
            </Box>
          )}
        </form>
      </Box>
    </Box>
  );
};
export default ReturnUserForm;
