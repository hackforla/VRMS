import React from 'react';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Typography, Box } from '@mui/material';

const NewUserForm = (props) => {
  return (
    <Box className="check-in-container">
      <Box className="check-in-headers">
        <Typography variant="h3">Welcome!</Typography>
        <Typography variant="h4">Tell us a little bit about yourself:</Typography>
      </Box>
      <Box className="check-in-form">
        <form
          className="form-check-in"
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
        >
          <Box className="form-row">
            <TextField
              label="First Name"
              variant="outlined"
              name="firstName"
              value={props.firstName.toString()}
              onChange={props.handleFirstNameChange}
              required
            />
          </Box>
          <Box className="form-row">
            <TextField
              label="Last Name"
              variant="outlined"
              name="lastName"
              value={props.lastName.toString()}
              onChange={props.handleLastNameChange}
              required
            />
          </Box>
          <Box className="form-row">
            <TextField
              label="Email Address"
              variant="outlined"
              type="email"
              name="email"
              value={props.formInput.email.toString()}
              onChange={props.handleInputChange}
              helperText="This allows easy use of the app. We'll never sell your data!"
              required
            />
          </Box>

          {props.questions.length !== 0 &&
            props.questions.map((question) => (
              question.type === "text" && (
                <Box key={question._id} className="form-row">
                  <TextField
                    label={question.questionText}
                    variant="outlined"
                    name={question.htmlName}
                    placeholder={question.placeholderText}
                    value={
                      Object.keys(props.formInput).includes(question.htmlName)
                        ? props.formInput[question.htmlName].toString()
                        : ""
                    }
                    onChange={props.handleInputChange}
                    required
                  />
                </Box>
              )
            ))}

          {props.questions.length !== 0 &&
            props.questions.map((question) => (
              question.type === "select" && (
                <Box key={question._id} className="form-row last-row">
                  <FormControl component="fieldset">
                    <FormLabel component="legend">{question.questionText}</FormLabel>
                    <RadioGroup
                      name={question.htmlName}
                      defaultValue="true"
                      onChange={props.handleNewMemberChange}
                    >
                      <FormControlLabel value="true" control={<Radio />} label="Yes" />
                      <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Box>
              )
            ))}

          {props.newMember === true
            ? null
            : props.questions.length !== 0 &&
              props.questions.map((question) => (
                question.htmlName === "attendanceLength" && (
                  <Box key={question._id} className="form-row">
                    <FormControl component="fieldset">
                      <FormLabel component="legend">{question.questionText}</FormLabel>
                      <FormControlLabel
                        control={
                          <select
                            name={question.htmlName}
                            value={props.month}
                            onChange={props.handleMonthChange}
                            required
                          >
                            {props.months.map((month, index) => (
                              <option key={index} value={month}>{month}</option>
                            ))}
                          </select>
                        }
                      />
                      <FormControlLabel
                        control={
                          <select
                            name={question.htmlName}
                            value={props.year}
                            onChange={props.handleYearChange}
                            required
                          >
                            {props.years.map((year, index) => (
                              <option key={index} value={year}>{year}</option>
                            ))}
                          </select>
                        }
                      />
                    </FormControl>
                  </Box>
                )
              ))}

          {props.isError && props.errorMessage.length > 1 &&
            <Typography color="error" className="error">{props.errorMessage}</Typography>
          }

          {!props.isLoading ? (
            <Box className="form-row">
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => props.checkInNewUser(e)}
              >
                {props.newMember ? 'CREATE PROFILE' : 'CHECK IN'}
              </Button>
            </Box>
          ) : (
            <Box className="form-row">
              <Button
                variant="contained"
                disabled
              >
                CHECKING IN...
              </Button>
            </Box>
          )}
        </form>
      </Box>
    </Box>
  );
};

export default NewUserForm;
