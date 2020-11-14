import React from 'react';
import './createAccount.scss';
import Button from '../common/button/button';
import Title from '../common/title/title';
import Input from '../common/input/input';
import ErrorMessage from '../common/errorMessage/errorMessage';
import RedirectLink from '../common/link/link';


const CreateAccountView = ({
    handleSubmitForm,
    handleInputChange,
    isDisabled,
    isEmailValid,
    errorMsgInvalidEmail,
    errorMsgRegisteredEmail,
}) => {
    return (
        <section data-testid="createAccount" className="createAccount-container">
        <Title />
  
        <form data-testid="createAccount-form" onSubmit={(e) => handleSubmitForm(e)}>
          <Input
            dataTestid="createAccount-input"
            placeholder={'Enter your email'}
            type={'email'}
            onChange={(e) => handleInputChange(e)}
            autoComplete={'email'}
          />
  
          <Button
            type={'submit'}
            content={`Create Account`}
            className={'createAccount-button'}
            disabled={isDisabled}
          />
        </form>
  
        {!isEmailValid && errorMsgInvalidEmail ? (
          <ErrorMessage content={'*Please enter a valid email address'} />
        ) : null}
  
        {errorMsgRegisteredEmail ? (
          <p className={'error-message'}>
            *You already have an account for that email address. Want to
            <RedirectLink
              path={'/login'}
              linkKey={'login'}
              content={' log in'}
            />
            ?
          </p>
        ) : null}
      </section>
    );
};

export default CreateAccountView;
