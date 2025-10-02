import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
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
  // MUI InputLabelProps Style
  const InputLabelProps = {
    sx: {
      backgroundColor: 'white',
      px: 0, // padding left/right
      width: '17em',
      '&.Mui-focused': {
        mt: 0.4, // only applies when the input is focused
      },
      '&.MuiInputLabel-shrink': {
        mt: 0.4,
      },
    },
  };
  // MUI FormLabel Style
  const FormLabelStyle = {
    color: 'black',
    fontWeight: 500,
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className="check-in-container">
        <Box className="check-in-headers">
          <Typography variant="h3" fontSize="3em">
            Welcome!
          </Typography>
          <Typography variant="h6">
            Tell us a little bit about yourself:
          </Typography>
        </Box>
        <Box className="check-in-form">
          <Box
            className="form-check-in"
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
          >
            <Box className="form-row">
              <TextField
                label="First Name"
                variant="outlined"
                InputLabelProps={{
                  sx: {
                    backgroundColor: 'white',
                    px: 0,
                    width: '6.3em',
                    '&.Mui-focused': {
                      mt: 0.4, // only applies when the input is focused
                    },
                    '&.MuiInputLabel-shrink': {
                      mt: 0.4,
                    },
                  },
                }}
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
                InputLabelProps={{
                  sx: {
                    backgroundColor: 'white',
                    px: 0,
                    width: '6.2em',
                    '&.Mui-focused': {
                      mt: 0.4, // only applies when the input is focused
                    },
                    '&.MuiInputLabel-shrink': {
                      mt: 0.4,
                    },
                  },
                }}
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
                InputLabelProps={{
                  sx: {
                    backgroundColor: 'white',
                    px: 0,
                    width: '8em',
                    '&.Mui-focused': {
                      mt: 0.4, // only applies when the input is focused
                    },
                    '&.MuiInputLabel-shrink': {
                      mt: 0.4,
                    },
                  },
                }}
                name="email"
                value={props.formInput.email.toString().toLowerCase()}
                onChange={props.handleInputChange}
                helperText="(This allows easy use of the app. We'll never sell your data!)"
                FormHelperTextProps={{
                  sx: {
                    marginBottom: '10px',
                    color: 'black',
                  },
                }}
                required
              />
            </Box>

            {props.questions.length !== 0 &&
              props.questions.map(
                (question) =>
                  question.type === 'text' && (
                    <Box key={question._id} className="form-row">
                      <TextField
                        label={question.questionText}
                        variant="outlined"
                        InputLabelProps={InputLabelProps}
                        name={question.htmlName}
                        placeholder={question.placeholderText}
                        value={
                          Object.keys(props.formInput).includes(
                            question.htmlName,
                          )
                            ? props.formInput[
                                question.htmlName.toString()
                              ].toString()
                            : ''
                        }
                        onChange={props.handleInputChange}
                        required
                      />
                    </Box>
                  ),
              )}

            {props.questions.length !== 0 &&
              props.questions.map(
                (question) =>
                  question.type === 'select' && (
                    <Box key={question._id} className="form-row last-row">
                      <FormControl component="fieldset">
                        <FormLabel component="legend" sx={FormLabelStyle}>
                          {question.questionText}
                        </FormLabel>
                        <RadioGroup
                          name={question.htmlName}
                          defaultValue="true"
                          onChange={props.handleNewMemberChange}
                        >
                          <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  ),
              )}
            {props.newMember === true
              ? null
              : props.questions.length !== 0 &&
                props.questions.map(
                  (question) =>
                    question.htmlName === 'attendanceLength' && (
                      <Box key={question._id} className="form-row">
                        <FormControl component="fieldset">
                          <FormLabel component="legend" sx={FormLabelStyle}>
                            {question.questionText}
                          </FormLabel>
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
                                label: {
                                  backgroundColor: 'white',
                                  width: '8em',
                                },
                              }}
                            >
                              {(params) => (
                                <TextField {...params} variant="outlined" />
                              )}
                            </DatePicker>
                          </FormControl>
                        </FormControl>
                      </Box>
                    ),
                )}

            {props.isError && props.errorMessage.length > 1 && (
              <Typography className="error">{props.errorMessage}</Typography>
            )}

            {!props.isLoading ? (
              <Box className="form-row">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => props.checkInNewUser(e, selectedDate)}
                  disabled={!selectedDate}
                >
                  {props.newMember ? 'CREATE PROFILE' : 'CHECK IN'}
                </Button>
              </Box>
            ) : (
              <Box className="form-row">
                <Button variant="contained" disabled>
                  CHECKING IN...
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default NewUserForm;
