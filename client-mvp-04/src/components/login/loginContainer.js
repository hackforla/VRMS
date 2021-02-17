import React, { useState } from 'react';
import LoginView from './loginView';
import { useDispatch } from 'react-redux';
import { Email } from '../../utils/validation/validation';
import { checkAuth, checkUser } from '../../services/user.service';
import { useHistory } from 'react-router-dom';
import allActions from '../../store/actions';
import { AUTH_ORIGIN } from '../../utils/constants';

const LoginContainer = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [LOG_IN, ,] = AUTH_ORIGIN;

  // Local UI State
  const [isDisabled, setIsDisabled] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [errorMsgInvalidEmail, setErrorMsgInvalidEmail] = useState(false);
  const [errorMsgFailedEmail, setErrorMsgFailedEmail] = useState(false);

  function handleInputChange(e) {
    setErrorMsgInvalidEmail(false);
    setErrorMsgFailedEmail(false);
    const inputValue = e.currentTarget.value.toString();
    inputValue ? setIsDisabled(false) : setIsDisabled(true);
    setUserEmail(inputValue);
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (Email.isValid(userEmail)) {
      setIsEmailValid(true);
      setErrorMsgInvalidEmail(false);
      const userData = await checkUser(userEmail, LOG_IN);
      const isAuth = await checkAuth(userEmail, LOG_IN);
      if (isAuth) {
        dispatch(allActions.authActions.setUser(userData));
        history.push('/login/auth');
      } else {
        setErrorMsgFailedEmail(true);
      }
    } else {
      setIsEmailValid(false);
      setErrorMsgInvalidEmail(true);
    }
  };

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

export default LoginContainer;
