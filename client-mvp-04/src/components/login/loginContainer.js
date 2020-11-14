import React, { useState } from 'react';
import LoginView from './loginView';
import { connect } from 'react-redux';
import { Email } from '../../utils/validation/validation';
import getUser from '../../services/user.service';
import { loginSuccess } from '../../store/actions/authActions';
import { setUser, failUser } from '../../store/actions/userActions';
import { useHistory } from 'react-router-dom';

const LoginContainer = (props) => {
  const history = useHistory();
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
      const userData = await getUser(userEmail);
      if (userData) {
        props.dispatch(loginSuccess());
        props.dispatch(setUser(userData));
        // while functionality isn't implemented redirect to dummy page
        history.push('/page');
      } else {
        setErrorMsgFailedEmail(true);
        props.dispatch(failUser());
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

const mapStateToProps = function (state) {
  return {
    loggedIn: state.auth.loggedIn,
  };
};

export default connect(mapStateToProps)(LoginContainer);
