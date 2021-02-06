import React, { useState } from 'react';
import CreateAccountView from './createAccountView';
import { Email } from '../../utils/validation/validation';
import { checkUser } from '../../services/user.service';
import { useHistory } from 'react-router-dom';

const CreateAccountContainer = () => {
  const history = useHistory();

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
      const userData = await checkUser(userEmail);
      if (!userData) {
        // user is not registered in app, redirect to the 1st of onboarding
        history.push('/onboarding/email-setup');
      } else {
        setErrorMsgRegisteredEmail(true);
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
