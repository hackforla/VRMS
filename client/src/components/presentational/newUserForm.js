import React from "react";

const NewUserForm = (props) => {
  return (
    <div className="check-in-container">
      <div className="check-in-headers">
        <h3>Welcome!</h3>
        <h4>Tell us a little bit about yourself:</h4>
      </div>
      <div className="check-in-form">
        <form
          className="form-check-in"
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="form-row">
            <div className="form-input-text">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={props.formInput.name?.firstName.toString()}
                onChange={props.handleInputChange}
                aria-label="First Name"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-input-text">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={props.formInput.name?.lastName.toString()}
                onChange={props.handleInputChange}
                aria-label="Last Name"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-input-text">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={props.formInput.email.toString()}
                onChange={props.handleInputChange}
                aria-label="Email Address"
                required
              />
              <label htmlFor="email">{"(This allows easy use of the app. We'll never sell your data!)"}</label>
            </div>
          </div>

          {props.questions.length !== 0 &&
            props.questions.map((question) => {
              return (
                question.type === "text" && (
                  <div key={question._id} className="form-row">
                    <div className="form-input-text">
                      <input
                        type="text"
                        name={question.htmlName}
                        placeholder={question.placeholderText}
                        value={
                          Object.keys(props.formInput).includes(
                            question.htmlName
                          )
                            ? props.formInput[
                                question.htmlName.toString()
                              ].toString()
                            : ""
                        }
                        onChange={props.handleInputChange}
                        required
                      />
                      <label htmlFor={question.htmlName}>{question.questionText}</label>
                    </div>
                  </div>
                )
              );
            })}

          {props.isError && props.errorMessage.length > 1 ? (
            <div className="error">{props.errorMessage}</div>
          ) : null}

          {!props.isLoading ? (
            <div className="form-row">
              <div className="form-input-button">
                <button
                  type="submit"
                  className="form-check-in-submit"
                  onClick={(e) => props.checkInNewUser(e)}
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
                  className="form-check-in-submit"
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
export default NewUserForm;
