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
                value={props.firstName.toString()}
                onChange={props.handleFirstNameChange}
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
                value={props.lastName.toString()}
                onChange={props.handleLastNameChange}
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

          {props.questions.length !== 0 &&
            props.questions.map((question) => {
              return (
                question.type === "select" && (
                  <div key={question._id} className="form-row last-row">
                    <div className="form-input-radio">
                      <label htmlFor={question.htmlName}>
                        Is this your first time attending a Hack Night?
                      </label>
                      <div className="radio-buttons first-time-select">
                        <input
                          id="radio1"
                          type="radio"
                          name={question.htmlName}
                          value={true}
                          onChange={props.handleNewMemberChange}
                          defaultChecked
                          required
                        />
                        <label htmlFor="radio1">Yes</label>
                        <input
                          id="radio2"
                          type="radio"
                          name={question.htmlName}
                          value={false}
                          onChange={props.handleNewMemberChange}
                        />
                        <label htmlFor="radio2">No</label>
                      </div>
                    </div>
                  </div>
                )
              );
            })}

          {props.newMember === true
            ? null
            : props.questions.length !== 0 &&
              props.questions.map((question) => {
                return (
                  question.htmlName === "attendanceLength" && (
                    <div key={question._id} className="form-row">
                      <div className="form-input-text">
                        <label htmlFor={question.htmlName}>
                          {question.questionText}
                        </label>
                        <div className="radio-buttons">
                          <select
                            name={question.htmlName}
                            value={props.month}
                            onChange={props.handleMonthChange}
                            required
                          >
                            {props.months.map((month, index) => {
                              return (
                                <option key={index} value={month}>
                                  {month}
                                </option>
                              );
                            })}
                          </select>
                          <select
                            name={question.htmlName}
                            value={props.year}
                            onChange={props.handleYearChange}
                            required
                          >
                            {props.years.map((year, index) => {
                              return (
                                <option key={index} value={year}>
                                  {year}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                  )
                );
              })}

          {props.isError && props.errorMessage.length > 1 &&
            <div className="error">{props.errorMessage}</div>
          }

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
