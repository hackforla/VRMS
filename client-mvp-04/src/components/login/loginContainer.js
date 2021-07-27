import React, { useEffect, useState } from 'react';
import LoginView from './loginView';
import { useDispatch } from 'react-redux';
import { Email } from '../../utils/validation/validation';
import { checkAuth, checkUser } from '../../services/user.service';
import { useHistory } from 'react-router-dom';
import allActions from '../../store/actions';
import { AUTH_ORIGIN } from '../../utils/constants';
import { getItem, setItem } from '../../services/localStorage.service';

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
    userEmail ? setIsDisabled(false) : setIsDisabled(true);
    inputValue !== userEmail && setUserEmail(inputValue);
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
        setItem('vrmsuser:email', userEmail);
      } else {
        setErrorMsgFailedEmail(true);
      }
    } else {
      setIsEmailValid(false);
      setErrorMsgInvalidEmail(true);
    }
  };

  useEffect(()=>{

    const value = getItem('vrmsuser:email');
    if(value) {
      setUserEmail(value.toString());
      setIsDisabled(false);
    }
  },[]); // [] gets email from local storage only on mount

  return (
    <LoginView
      handleSubmitForm={handleSubmitForm}
      handleInputChange={handleInputChange}
      isDisabled={isDisabled}
      isEmailValid={isEmailValid}
      errorMsgInvalidEmail={errorMsgInvalidEmail}
      errorMsgFailedEmail={errorMsgFailedEmail}
      userEmail={userEmail}
    />
  );
};

export default LoginContainer;
