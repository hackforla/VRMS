import React, { useState } from 'react';
import LoginView from './loginView';
import { connect } from 'react-redux';
import { Email } from '../../utils/validation';

const LoginContainer = () => {
  // Local UI State
  const [isDisabled, setIsDisabled] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [errorMsgInvalidEmail, setErrorMsgInvalidEmail] = useState(false);
  const [errorMsgFailedEmail, setErrorMsgFailedEmail] = useState(false);

  function handleInputChange(e) {
    let inputValue = e.currentTarget.value.toString();
    inputValue ? setIsDisabled(false) : setIsDisabled(true);
    setUserEmail(inputValue);
  }

  function handleSubmitForm(e) {
    if (Email.isValid(userEmail)) {
      setIsEmailValid(true);
      setErrorMsgInvalidEmail(false);
    } else {
      setIsEmailValid(false);
      setErrorMsgInvalidEmail(true);
    }
    e.preventDefault();
  }

  return (
    <LoginView
      handleSubmitForm={handleSubmitForm}
      handleInputChange={handleInputChange}
      isDisabled={isDisabled}
      isEmailValid={isEmailValid}
      errorMsgInvalidEmail={errorMsgInvalidEmail}
      errorMsgFailedEmail={errorMsgFailedEmail}
    />
  );
};

const mapStateToProps = function (state) {
  return {
    loggedIn: state.auth.loggedIn,
  };
};

export default connect(mapStateToProps)(LoginContainer);
