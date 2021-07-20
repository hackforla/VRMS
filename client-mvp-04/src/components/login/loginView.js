import React from 'react';
import './login.scss';
import Button from '../common/button/button';
import Title from '../common/title/title';
import Input from '../common/input/input';
import ErrorMessage from '../common/errorMessage/errorMessage';
import RedirectLink from '../common/link/link';

const LoginView = ({
  handleSubmitForm,
  handleInputChange,
  isDisabled,
  isEmailValid,
  errorMsgInvalidEmail,
  errorMsgFailedEmail,
  userEmail
}) => {
  return (
    <section data-testid="login-container" className="flex-container login">
      <Title />

      <form data-testid="login-form" onSubmit={(e) => handleSubmitForm(e)}>
        <Input
          dataTestid="login-input"
          placeholder={'Enter your email'}
          type={'email'}
          onChange={(e) => handleInputChange(e)}
          autoComplete={'email'}
          value={userEmail}
        />

        <Button
          type={'submit'}
          content={`Sign in`}
          className={'login-button'}
          disabled={isDisabled}
        />
      </form>

      {!isEmailValid && errorMsgInvalidEmail ? (
        <ErrorMessage content={'*Please enter a valid email address'} />
      ) : null}

      {errorMsgFailedEmail ? (
        <p className={'error-message'}>
          *We don’t recognize your email address. Need to
          <RedirectLink
            path={'/create-account'}
            linkKey={'create-account'}
            content={' create an account'}
          />
          ?
        </p>
      ) : null}
    </section>
  );
};

export default LoginView;
