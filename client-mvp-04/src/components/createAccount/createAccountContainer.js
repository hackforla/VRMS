import React, { useState } from 'react';
import CreateAccountView from './createAccountView';
import { connect } from 'react-redux';
import { Email } from '../../utils/validation';
import UserService from '../../services/user.service';
import { setUser } from '../../store/actions/userActions';

const CreateAccountContainer = (props) => {
  // Local UI State
  const [isDisabled, setIsDisabled] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [errorMsgInvalidEmail, setErrorMsgInvalidEmail] = useState(false);
  const [errorMsgRegisteredEmail, setErrorMsgRegisteredEmail] = useState(false);

  function handleInputChange(e) {
    setErrorMsgInvalidEmail(false);
    setErrorMsgRegisteredEmail(false);
    const inputValue = e.currentTarget.value.toString();
    inputValue ? setIsDisabled(false) : setIsDisabled(true);
    setUserEmail(inputValue);
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (Email.isValid(userEmail)) {
      setIsEmailValid(true);
      setErrorMsgInvalidEmail(false);
      const userData = await UserService.getData(userEmail);
      if ( ! userData ) {
        // user is not registered in app, redirect to dummny page 
        props.history.push('/page');
      } else {
        // user is already registered in app, update global state in store
        setErrorMsgRegisteredEmail(true);
        props.dispatch(setUser(userData));
      }
    } else {
      setIsEmailValid(false);
      setErrorMsgInvalidEmail(true);
    }
  };

  return (
    <CreateAccountView
      handleSubmitForm={handleSubmitForm}
      handleInputChange={handleInputChange}
      isDisabled={isDisabled}
      isEmailValid={isEmailValid}
      errorMsgInvalidEmail={errorMsgInvalidEmail}
      errorMsgRegisteredEmail={errorMsgRegisteredEmail}
    />
  );  
};

export default CreateAccountContainer; 