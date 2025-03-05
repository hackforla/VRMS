import React, { useState } from 'react';
import { FormControl, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import '../../sass/CheckIn.scss';

const NewUserForm = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const minDate = new Date(2013, 0);
  const maxDate = new Date();
  const handleDateChange = (newValue) => {
    if (newValue instanceof Date && !isNaN(newValue)) {
      setSelectedDate(newValue); // Ensure only a valid Date object is set
    } else {
      console.error('Invalid date selected:', newValue);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                <label htmlFor="email">
                  {
                    "(This allows easy use of the app. We'll never sell your data!)"
                  }
                </label>
              </div>
            </div>

            {props.questions.length !== 0 &&
              props.questions.map((question) => {
                return (
                  question.type === 'text' && (
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
                              : ''
                          }
                          onChange={props.handleInputChange}
                          required
                        />
                        <label htmlFor={question.htmlName}>
                          {question.questionText}
                        </label>
                      </div>
                    </div>
                  )
                );
              })}

            {props.questions.length !== 0 &&
              props.questions.map((question) => {
                return (
                  question.type === 'select' && (
                    <div key={question._id} className="form-row last-row">
                      <div className="form-input-radio">
                        <label htmlFor={question.htmlName}>
                          IS THIS YOUR FIRST TIME ATTENDING A HACK FOR LA
                          MEETING?
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
                    question.htmlName === 'attendanceLength' && (
                      <div key={question._id} className="form-row">
                        <div className="form-input-text">
                          <label htmlFor={question.htmlName}>
                            {question.questionText}
                          </label>
                          <FormControl
                            sx={{
                              margin: '1rem 0',
                              width: '100%',
                            }}
                          >
                            <DatePicker
                              views={['year', 'month']}
                              label="Month and Year"
                              minDate={minDate}
                              maxDate={maxDate}
                              value={selectedDate}
                              onChange={handleDateChange}
                              inputFormat="MMM yyyy"
                              localeText={{
                                fieldMonthPlaceholder: () => 'Month',
                                fieldYearPlaceholder: () => 'Year',
                              }}
                              sx={{
                                width: '100%',
                                maxWidth: '300px',
                                borderBottom: 'none',
                                '& input[type=text]': {
                                    height: '40px',
                                    width: '100%',
                                    borderBottom: 'none',
                                    paddingLeft: '0.5rem',
                                    color: 'rgb(250, 17, 79)',
                                    fontWeight: '600', // semi-bold
                                  },
                              }}
                            >
                              {(params) => (
                                <TextField {...params} variant="outlined" />
                              )}
                            </DatePicker>
                          </FormControl>
                        </div>
                      </div>
                    )
                  );
                })}

            {props.isError && props.errorMessage.length > 1 && (
              <div className="error">{props.errorMessage}</div>
            )}

            {!props.isLoading ? (
              <div className="form-row">
                <div className="form-input-button">
                  <button
                    type="submit"
                    className="form-check-in-submit"
                    onClick={(e) => props.checkInNewUser(e, selectedDate)}
                    disabled={!selectedDate}
                  >
                    {props.newMember ? 'CREATE PROFILE' : 'CHECK IN'}
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
    </LocalizationProvider>
  );
};

export default NewUserForm;
