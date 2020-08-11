import React, { useEffect } from "react";

const ReturnUserForm = (props) => {

  return (
    <div className="check-in-container">
      <div className="check-in-headers">
        <h3>Welcome back!</h3>
      </div>
      <div className="check-in-form">
        <form
          className="form-check-in"
          autoComplete="off"
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
                // aria-label="topic"
                onChange={props.handleInputChange}
                aria-label="Email Address"
                required
                autoComplete="email"
              />
            </div>
            <p>
              {
                "(This allows easy use of the app. We'll never sell your data!)"
              }
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
                  disabled={!!!props.formInput.email}
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

          {/* {props.user !== null &&
            props.user !== false &&
            props.user.attendanceReason === undefined &&
            <>
              {
                props.questions.map((question) => question.htmlName === "attendanceReason" && (
                  <div key={question._id} className="form-row">
                    <div className="form-input-text">
                      <label htmlFor={question.htmlName}>
                        {question.questionText}
                      </label>
                      <div className="select-reason">
                        <select
                          name={question.htmlName}
                          value={props.reason}
                          // aria-label="topic"
                          onChange={props.handleReasonChange}
                          required
                        >
                          {props.reasons.map((reason, index) => {
                            return (
                              <option key={index} value={reason}>
                                {reason}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              }
              <div className="form-row">
                  <div className="form-input-button">
                    {!props.isLoading ? (
                      <button
                      type="submit"
                      className="form-check-in-submit"
                      onClick={(e) => props.submitReturning(props.user, e)}
                      >
                        CHECK IN
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="form-check-in-submit block"
                        onClick={(e) => e.preventDefault()}
                      >
                        CHECKING IN...
                      </button>
                    )}
                  </div>
              </div>
            </>
          } */}

          {/* {props.user !== null &&
            props.user !== false &&
            props.user.currentProject === undefined &&
            props.questions.map((question) => {
              return (
                question.htmlName === "currentProject" && (
                  <div key={question._id} className="form-row">
                    <div className="form-input-text">
                      <label htmlFor={question.htmlName}>
                        {question.questionText}
                      </label>
                      <div className="select-reason">
                        <select
                          name={question.htmlName}
                          value={props.project}
                          // aria-label="topic"
                          onChange={props.handleProjectChange}
                          required
                        >
                          {props.projects.map((project, index) => {
                            return (
                              <option key={index} value={project}>
                                {project}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                )
              );
            })} */}
        </form>
      </div>
    </div>
  );
};
export default ReturnUserForm;
