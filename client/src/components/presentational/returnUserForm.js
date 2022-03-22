import React from 'react';

const ReturnUserForm = (props) => {
  return (
    <div className="check-in-container">
      <div className="check-in-headers">
        <h3>Welcome back!</h3>
      </div>
      <div className="check-in-form">
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
            <p>
              {"(This allows easy use of the app. We'll never sell your data!)"}
            </p>
          </div>

          {props.isError && props.errorMessage.length > 1 ? (
            <div className="error">{props.errorMessage}</div>
          ) : null}
          {props.user === false && (
            <div className="error">Try entering your email again.</div>
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
      </div>
    </div>
  );
};
export default ReturnUserForm;
