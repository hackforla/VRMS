import React, { useState, useEffect } from 'react';
import moment from 'moment';
import NewUserForm from './../components/presentational/newUserForm';
import ReturnUserForm from './../components/presentational/returnUserForm';
import { REACT_APP_CUSTOM_REQUEST_HEADER as headerToSend } from '../utils/globalSettings';
import { format } from 'date-fns';

import '../sass/CheckIn.scss';

const CheckInForm = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newOrReturning] = useState(props && props.match.params.userType);

  // eslint-disable-next-line no-unused-vars
  const [eventId, setEventId] = useState(
    props.location.search.slice(9, props.location.search.length)
  );
  const [formInput, setFormInput] = useState({
    email: '',
    currentRole: '',
    desiredRole: '',
    attendanceLength: '',
  });
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newMember, setNewMember] = useState(true);
  const [month, setMonth] = useState(moment().format('MMM').toUpperCase());
  const [year, setYear] = useState(moment().format('YYYY'));
  const [reason, setReason] = useState('--SELECT ONE--');
  const [project, setProject] = useState('--SELECT ONE--');
  const [user, setUser] = useState(null);
  console.log(props.location.pathname);

  // form data to fill drop-downs
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
  const currentYear = new Date().getFullYear();
  const startYear = 2013;
  const years = [];

  for (let year = currentYear; year >= startYear; year--) {
    years.push(year.toString());
  }

  const reasons = [
    '--SELECT ONE--',
    'Open Data',
    'Homelessness',
    'Social Justice/Equity',
    'Transportation',
    'Mental Health',
    'Civic Engagement',
    'Environment',
    'Education/STEM',
    'Fundraising',
  ];

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/questions', {
        headers: {
          'x-customrequired-header': headerToSend,
        },
      });
      const resJson = await res.json();

      setQuestions(resJson);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) =>
    setFormInput({
      ...formInput,
      [e.currentTarget.name]: e.currentTarget.value,
    });

  const handleFirstNameChange = (e) => setFirstName(e.currentTarget.value);
  const handleLastNameChange = (e) => setLastName(e.currentTarget.value);
  const handleMonthChange = (e) => setMonth(e.currentTarget.value);
  const handleYearChange = (e) => setYear(e.currentTarget.value);

  const handleReasonChange = (e) => {
    setReason(e.currentTarget.value);
    setIsQuestionAnswered(true);
  };

  const handleProjectChange = (e) => {
    setProject(e.currentTarget.value);
    setIsQuestionAnswered(true);
  };

  const handleNewMemberChange = (e) => {
    if (e.target.value === 'true') {
      setNewMember(true);
      setMonth(moment().format('MMM').toUpperCase());
      setYear(moment().format('YYYY'));
    }

    if (e.target.value === 'false') {
      setNewMember(false);
    }
  };

  const submitForm = async (userForm) => {
    // First, create a new user in the user collection

    const userRes = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-customrequired-header': headerToSend,
      },
      body: JSON.stringify(userForm),
    });

    if (userRes.status === 409) {
      const error = await userRes.json();
      setIsError(true);
      setErrorMessage(error.message);
      return;
    }

    if (!userRes.ok) {
      throw new Error(userRes.statusText);
    }

    const userData = await userRes.json();
    const userId = userData._id;
    const eventId = new URLSearchParams(props.location.search).get('eventId');

    const checkinRes = await fetch('/api/checkins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-customrequired-header': headerToSend,
      },
      body: JSON.stringify({ userId, eventId }),
    });

    if (!checkinRes.ok) {
      throw new Error(checkinRes.statusText);
    }

    props.history.push(`/success?eventId=${eventId}`);
  };

  const submitReturning = (returningUser, e = null) => {
    e && e.preventDefault();

    const answer = {
      newMember: false,
    };

    if (reason !== '--SELECT ONE--') {
      answer.attendanceReason = reason;
    }

    const answerJson = JSON.stringify(answer);

    try {
      fetch(`/api/users/${returningUser.user._id}`, {
        method: 'PATCH',
        body: answerJson,
        headers: {
          'Content-Type': 'application/json',
          'x-customrequired-header': headerToSend,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }

          throw new Error(res.statusText);
        })
        .then((response) => {
          const checkInForm = {
            userId: `${returningUser?.user?._id}`,
            eventId: new URLSearchParams(props.location.search).get('eventId'),
          };

          return fetch('/api/checkins', {
            method: 'POST',
            body: JSON.stringify(checkInForm),
            headers: {
              'Content-Type': 'application/json',
              'x-customrequired-header': headerToSend,
            },
          })
            .then((res) => {
              if (res.ok) {
                return props.history.push('/success');
              }
              console.log('throwing new error in line 230');
              throw new Error(res.statusText);
            })
            .catch((error) => {
              console.log(error.error);
              setIsError(true);
              setErrorMessage(error);
              setIsLoading(false);
            });
        })
        .catch((error) => {
          console.log(error);
          setIsError(true);
          setErrorMessage(error);
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
      setIsError(true);
      setErrorMessage(error);
      setIsLoading(false);
    }
    // }
  };

  const submitNewProfile = (userForm) => {
    // First, create a new user in the user collection

    fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(userForm),
      headers: {
        'Content-Type': 'application/json',
        'x-customrequired-header': headerToSend,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        throw new Error(res.statusText);
      })
      .then((responseId) => {
        if (responseId.includes('E11000')) {
          setIsError(true);
          setErrorMessage('Email address is already in use.');
        } else {
          props.history.push(`/success`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkInNewUser = (e, selectedDate) => {
    e.preventDefault();

    const firstAttended = format(selectedDate, 'MMM yyyy').toUpperCase();

    // SET all of the user's info from useState objects
    const userForm = {
      name: {
        firstName,
        lastName,
      },
      ...formInput,
      newMember,
      firstAttended,
    };

    let ready = true;

    try {
      setIsLoading(true);

      if (
        userForm.name.firstName === '' ||
        userForm.name.lastName === '' ||
        userForm.email === '' ||
        userForm.currentRole === '' ||
        userForm.desiredRole === '' ||
        firstAttended === ''
      ) {
        setIsError(true);
        setErrorMessage("Please don't leave any fields blank");
        ready = false;
      }

      const currYear = parseInt(moment().format('YYYY'));
      const currMonth = parseInt(moment().format('MM'));
      const yearJoined = parseInt(year);
      const monthJoined = parseInt(moment(month + ' 9, 2020').format('MM'));

      if (
        yearJoined > currYear ||
        (yearJoined === currYear && monthJoined > currMonth)
      ) {
        setIsError(true);
        setErrorMessage(
          "You can't set a date in the future... Please try again."
        );
        ready = false;
      }

      if (ready) {
        submitForm(userForm);
      }

      setIsLoading(false);
    } catch (error) {
      console.log('Error during form submission:', error);
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const createNewProfile = (e) => {
    e.preventDefault();

    const firstAttended = `${month} ${year}`;

    // SET all of the user's info from useState objects
    const userForm = {
      name: {
        firstName,
        lastName,
      },
      ...formInput,
      newMember,
      firstAttended,
    };

    let ready = true;

    try {
      setIsLoading(true);

      if (
        userForm.name.firstName === '' ||
        userForm.name.lastName === '' ||
        userForm.email === '' ||
        userForm.currentRole === '' ||
        userForm.desiredRole === '' ||
        firstAttended === ''
      ) {
        setIsError(true);
        setErrorMessage("Please don't leave any fields blank");
        ready = false;
      }

      const currYear = parseInt(moment().format('YYYY'));
      const currMonth = parseInt(moment().format('MM'));
      const yearJoined = parseInt(year);
      // extra date info needed to be recognized as a date
      const monthJoined = parseInt(moment(month + ' 9, 2020').format('MM'));

      if (
        yearJoined > currYear ||
        (yearJoined === currYear && monthJoined > currMonth)
      ) {
        setIsError(true);
        setErrorMessage(
          "You can't set a date in the future... Please try again."
        );
        ready = false;
      }

      // SUBMIT all of the user's info from the userForm object
      if (ready) {
        submitNewProfile(userForm);
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const checkEmail = (e) => {
    e.preventDefault();

    try {
      if (!formInput.email) {
        throw new Error('User email is required');
      }

      setIsLoading(true);

      fetch('/api/checkuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-customrequired-header': headerToSend,
        },
        body: JSON.stringify({ email: formInput.email }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error(res.statusText);
        })
        .then((resJson) => {
          setUser(resJson);
          setIsLoading(false);
          resJson && submitReturning(resJson);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
      setIsError(true);
      setErrorMessage(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="flex-container">
      {props.location.pathname === '/newProfile' && (
        <NewUserForm
          firstName={firstName}
          handleFirstNameChange={handleFirstNameChange}
          lastName={lastName}
          handleLastNameChange={handleLastNameChange}
          formInput={formInput}
          handleInputChange={handleInputChange}
          questions={questions}
          handleNewMemberChange={handleNewMemberChange}
          handleMonthChange={handleMonthChange}
          newMember={newMember}
          months={months}
          month={month}
          handleYearChange={handleYearChange}
          years={years}
          isError={isError}
          errorMessage={errorMessage}
          isLoading={isLoading}
          checkInNewUser={checkInNewUser}
        />
      )}

      {newOrReturning === 'returningUser' && (
        <ReturnUserForm
          user={user}
          formInput={formInput}
          handleInputChange={handleInputChange}
          isError={isError}
          errorMessage={errorMessage}
          isLoading={isLoading}
          checkEmail={checkEmail}
          questions={questions}
          reason={reason}
          handleReasonChange={handleReasonChange}
          reasons={reasons}
          project={project}
          handleProjectChange={handleProjectChange}
          submitReturning={submitReturning}
        />
      )}

      {newOrReturning === 'newUser' && (
        <NewUserForm
          firstName={firstName}
          handleFirstNameChange={handleFirstNameChange}
          lastName={lastName}
          handleLastNameChange={handleLastNameChange}
          formInput={formInput}
          handleInputChange={handleInputChange}
          questions={questions}
          handleNewMemberChange={handleNewMemberChange}
          handleMonthChange={handleMonthChange}
          newMember={newMember}
          months={months}
          month={month}
          handleYearChange={handleYearChange}
          years={years}
          isError={isError}
          errorMessage={errorMessage}
          isLoading={isLoading}
          checkInNewUser={checkInNewUser}
        />
      )}
    </div>
  );
};

export default CheckInForm;
