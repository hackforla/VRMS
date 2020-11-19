import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import CreateAccountView from './createAccountView';
import { BrowserRouter } from 'react-router-dom';

afterEach(cleanup);

describe('Create Account', () => {
  test('Should render component with props', () => {
    const props = {
      handleSubmitForm: () => {},
      handleInputChange: () => {},
      isDisabled: true,
      isEmailValid: false,
      errorMsgInvalidEmail: false,
      errorMsgRegisteredEmail: false,
    };

    render(
      <CreateAccountView
        handleSubmitForm={props.handleSubmitForm}
        handleInputChange={props.handleInputChange}
        isDisabled={props.isDisabled}
        isEmailValid={props.isEmailValid}
        errorMsgInvalidEmail={props.errorMsgInvalidEmail}
        errorMsgFailedEmail={props.errorMsgRegisteredEmail}
      />,
      { wrapper: BrowserRouter }
    );
    expect(screen.getByTestId('create-account-container')).toBeInTheDocument();
    expect(screen.getByTestId('create-account-form')).toBeInTheDocument();
    expect(screen.getByTestId('create-account-input')).toBeInTheDocument();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });
});
