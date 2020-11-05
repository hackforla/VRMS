import React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import Register from './register';
import { BrowserRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event'

afterEach(cleanup);

describe('register', () => {
    test('Should render component with name of project', () => {
        render(<Register />, { wrapper: BrowserRouter });
        expect(screen.getByTestId('register')).toBeInTheDocument();
        const h1 = screen.getByText(/VRMS/i);
        const h2 = screen.getByText(/Volunteer Relationship Management System/i);
        expect(h1).toBeInTheDocument();
        expect(h2).toBeInTheDocument();
    });

    test('Should have input field and create acount button', () => {
        render(<Register />, { wrapper: BrowserRouter });
        expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
        expect(screen.getByText('Create Account')).toBeInTheDocument();
    });

    test('Should display error message when invalid email address is entered', () => {
        render(<Register />, { wrapper: BrowserRouter });
        userEvent.type(screen.getByPlaceholderText('Enter your email'), 'j4pioej;dsfasd');
        expect(screen.getByRole('textbox')).toHaveValue('j4pioej;dsfasd');
        fireEvent.click(screen.getByText('Create Account'));
        expect(screen.getByTestId('error-msg')).toHaveTextContent('*Please enter a valid email address');
    }); 








});