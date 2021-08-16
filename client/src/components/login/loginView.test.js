import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginView from './loginView';
import { BrowserRouter } from 'react-router-dom';

describe('Login View', () => {
  test('Should render component with props', () => {
    const props = {
      handleSubmitForm: () => {},
      handleInputChange: () => {},
      isDisabled: true,
      isEmailValid: false,
      errorMsgInvalidEmail: false,
      errorMsgFailedEmail: false,
    };

    render(
      <LoginView
        handleSubmitForm={props.handleSubmitForm}
        handleInputChange={props.handleInputChange}
        isDisabled={props.isDisabled}
        isEmailValid={props.isEmailValid}
        errorMsgInvalidEmail={props.errorMsgInvalidEmail}
        errorMsgFailedEmail={props.errorMsgFailedEmail}
      />,
      { wrapper: BrowserRouter }
    );
  });

  test('Should display form with input and `Sign In` button', () => {
    render(<LoginView />, { wrapper: BrowserRouter });
    expect(screen.getByTestId('login-container')).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('login-input')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });
});
