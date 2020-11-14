import React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import CreateAccountView from './createAccountView';
import { BrowserRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event'

afterEach(cleanup);

describe('createAccount', () => {

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
    
        expect(screen.getByTestId('createAccount')).toBeInTheDocument();
        expect(screen.getByTestId('createAccount-form')).toBeInTheDocument();
        expect(screen.getByTestId('createAccount-input')).toBeInTheDocument();
        expect(screen.getByText('Create Account')).toBeInTheDocument();
      });


    test('Should display error message when invalid email address is entered', () => {
        const props = {
            handleSubmitForm: () => {},
            handleInputChange: () => {},
            isDisabled: true,
            isEmailValid: false,
            errorMsgInvalidEmail: true,
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

        expect(screen.getByText('*Please enter a valid email address')).toBeInTheDocument();
    }); 

});