import React, { useState, useEffect } from 'react';
import NewUserForm from './../components/presentational/newUserForm';
import ReturnUserForm from './../components/presentational/returnUserForm';

import '../sass/CheckIn.scss';

const _apiHost = '/api';
const _customHeader = process.env.REACT_APP_CUSTOM_REQUEST_HEADER;

async function request(url, params, method = 'GET') {
  function objectToQueryString(obj) {
    return Object.keys(obj)
      .map((key) => key + '=' + obj[key])
      .join('&');
  }

  // options passed to the fetch request
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-customrequired-header': _customHeader,
    },
  };

  // if params exists and method is GET, add query string to url
  // otherwise, just add params as a "body" property to the options object
  if (params) {
    if (method === 'GET') {
      url += '?' + objectToQueryString(params);
    } else {
      options.body = JSON.stringify(params); // body should match Content-Type in headers option
    }
  }

  // fetch returns a promise, so we add keyword await to wait until the promise settles
  try {
    const response = await fetch(_apiHost + url, options);

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    const result = await response.json(); // convert response into JSON

    // returns a single Promise object
    return result;
  } catch (error) {
    throw error;
  }
}

const CheckInForm = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newOrReturning] = useState(props && props.match.params.userType);
  const [user, setUser] = useState(null);
  const [formInput, setFormInput] = useState({
    name: {
      firstName: '',
      lastName: '',
    },
    email: '',
    currentRole: '',
    desiredRole: '',
    newMember: true,
  });

  /**
   *
   * @param {Object} userObject
   * @returns A new user object
   */
  async function createNewUser(userObject) {
    try {
      const response = await request('/users', userObject, 'POST');
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * The function uses the endpoint '/api/checkins' to checkin a user to a event. Upon succesfull completion
   * the function returns a checkin object. Otherwise on failure it throws an error Object.
   *
   * @param {String} userId  The string _id that uniquely identifies a user
   * @param {String} eventId The string _id that uniquely identifies an event
   * @returns A checkIn object
   */
  async function checkInUserToEvent(userId, eventId) {
    try {
      const response = await request(
        '/checkins',
        { userId: userId, eventId: eventId },
        'POST'
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Given an email, the function checks if a user exist under that email. If it finds the user, the function
   * returns the user Object. If no user is found connected to the email the function throws an error "User Not Found"
   *
   * @param {String} email
   * @returns A User Object
   */
  async function checkUserExistenceByEmail(email) {
    try {
      const response = await request('/checkuser', { email: email }, 'POST');
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @returns An object of questions and answers.
   */
  async function getAllQuestions() {
    try {
      const response = await request('/questions');
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * This function makes use of the getAllQuestion function to populate the forms with questions
   * using the react setState => setQuestions
   */
  const fetchQuestions = async () => {
    try {
      setIsLoading(true);

      const questions = await getAllQuestions();

      setQuestions(questions);

      setIsLoading(false);
    } catch (error) {
      console.log(error);

      setIsLoading(false);
    }
  };

  /**
   * Changes in the form input fields are handled by this function and mapped to the
   * formInput Object via => setFormInput()
   * @param {Event} e
   */
  const handleInputChange = (e) => {
    if (
      e.currentTarget.name === 'firstName' ||
      e.currentTarget.name === 'lastName'
    ) {
      setFormInput({
        ...formInput,
        name: {
          ...formInput.name,
          [e.currentTarget.name]: e.currentTarget.value,
        },
      });
    } else {
      setFormInput({
        ...formInput,
        [e.currentTarget.name]: e.currentTarget.value,
      });
    }
  };

  /**
   * Validates form data by ensuring that no fields are blank strings.
   * @param {Object} formInput The form input object as represented by the setFormInput state
   * @return {Error}, Throws an error message if a form field is blank
   */
  const validateNewUserFormInput = (formInput) => {
    if (
      formInput.name.firstName === '' ||
      formInput.name.lastName === '' ||
      formInput.email === '' ||
      formInput.currentRole === '' ||
      formInput.desiredRole === ''
    ) {
      throw new Error("Please don't leave any fields blank");
    }
  };

  /**
   * Validates form data by ensuring that the email field is not blank
   * @param {Object} formInput The form input object as represented by the setFormInput state
   * @return {Error}, Throws an error message if the form email field is blank
   */
  const validateReturningUserFormInput = (formInput) => {
    if (!formInput.email) {
      throw new Error('User email is required');
    }
  };

  /**
   * Checks in a new user by
   *   1. validating the form data with => validateNewUserFormInput
   *        - Invalid form data triggers `setIsError` and `setErrorMessage`
   *   2. Creating a new user
   *   3. Checking in the new user to an event
   *   4. Redirects to /success page upon succesfull check in
   * @param {Event} e The event that is triggered by pressing on the submit button on the newUserForm
   *                It is only used to prevent default behaviour of form submission
   */
  const checkInNewUser = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      validateNewUserFormInput(formInput);

      const newUser = await createNewUser(formInput);
      const eventId = new URLSearchParams(props.location.search).get('eventId');

      await checkInUserToEvent(newUser._id, eventId);

      setIsLoading(false);

      props.history.push(`/success`);
    } catch (error) {
      setIsError(true);
      error.error.code === 11000 &&
        setErrorMessage('Email address is already in use!');
      setIsLoading(false);
    }
  };

  /**
   * Checks in a new user by
   *   1. validating the form data with => validateReturningUserFormInput
   *        - Invalid form data triggers `setIsError` and `setErrorMessage`
   *   2. checking if the email provided exists in the database
   *        - throws error if email not found
   *   3. Checking in the new user to an event
   *   4. Redirects to /success page upon succesfull check in
   * @param {Event} e The event that is triggered by pressing on the submit button on the returningUserForm
   *                  It is only used to prevent default behaviour of form submission
   */
  const checkInReturningUser = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      validateReturningUserFormInput(formInput);

      const user = await checkUserExistenceByEmail(formInput.email);
      const eventId = new URLSearchParams(props.location.search).get('eventId');

      await checkInUserToEvent(user._id, eventId);

      setIsLoading(false);
      props.history.push(`/success`);
    } catch (error) {
      setIsError(true);
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="flex-container">
      {(props.location.pathname === '/newProfile' ||
        newOrReturning === 'newUser') && (
        <NewUserForm
          questions={questions}
          formInput={formInput}
          handleInputChange={handleInputChange}
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
          checkInReturningUser={checkInReturningUser}
        />
      )}
    </div>
  );
};

export default CheckInForm;
