import React from 'react';
import { Box, Container, CircularProgress, Typography } from '@mui/material';

const ReturnUserForm = (props) => {
  return (
    <Container className="check-in-container">
      <Box className="check-in-headers">
        <Typography variant='h3'>Welcome back!</Typography>
      </Box>
      <Box className="check-in-form">
        <form
          className="form-check-in"
          autoComplete="on"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="form-row">
            <div className="form-input-text">
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
            </div>
            <Typography>
              {"(This allows easy use of the app. We'll never sell your data!)"}
            </Typography>
          </div>

          {props.isError && props.errorMessage.length > 1 &&
            <Box className="error">{props.errorMessage}</Box>
          }
          {props.user === false && (
            <Box className="error">Try entering your email again.</Box>
          )}

          {!props.user && !props.isLoading ? (
            <div className="form-row">
              <div className="form-input-button">
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
              </div>
            </div>
          ) : (
            <div className="form-row">
              <div className="form-input-button">
                <button
                  type="submit"
                  className="form-check-in-submit block"
                  onClick={(e) => e.preventDefault()}
                >
                  CHECKING IN...
                </button>
              </div>
            </div>
          )}
        </form>
      </Box>
    </Container>
  );
};
export default ReturnUserForm;
