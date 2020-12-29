import React from 'react';
import LoginContainer from './loginContainer';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import service from '../../services/user.service';
import { mockUserData } from '../../utils/__tests__/mocks/authMock';
import { testRender, createTestStore } from '../../utils/__tests__/testUtils';

jest.mock('../../services/user.service', () => jest.fn());
service.checkUser = jest.fn(() => {
  return mockUserData;
});
service.checkAuth = jest.fn(() => {
  return true;
});

beforeEach(() => {
  const store = createTestStore();
  testRender(<LoginContainer />, { store });
});

afterEach(cleanup);

describe('Login Container', () => {
  describe('`Sign In` Button', () => {
    test('Should be disabled by default', () => {
      expect(screen.getByText('Sign in')).toBeDisabled();
    });

    test('Should be disabled when the input value contains only spaces', () => {
      expect(screen.getByText('Sign in')).toBeDisabled();
      const loginInput = screen.getByTestId('login-input');
      fireEvent.change(loginInput, { target: { value: ' ' } });
      expect(screen.getByText('Sign in')).toBeDisabled();
    });

    test('Should be enable when the input value isn`t empty', () => {
      expect(screen.getByText('Sign in')).toBeDisabled();
      const loginInput = screen.getByTestId('login-input');
      fireEvent.change(loginInput, { target: { value: 't' } });
      expect(screen.getByText('Sign in')).not.toBeDisabled();
      fireEvent.change(loginInput, { target: { value: 'test' } });
      expect(screen.getByText('Sign in')).not.toBeDisabled();
    });
  });

  test('Should display error message if email invalid', () => {
    const loginInput = screen.getByTestId('login-input');
    expect(loginInput).toBeInTheDocument();
    fireEvent.change(loginInput, { target: { value: 'test@gmail.c' } });
    fireEvent.submit(screen.getByTestId('login-form'));
    expect(
      screen.getByText('*Please enter a valid email address')
    ).toBeInTheDocument();
  });

  test('Should get user from UserService if user registered in the app', () => {
    const loginInput = screen.getByTestId('login-input');
    expect(loginInput).toBeInTheDocument();
    fireEvent.change(loginInput, { target: { value: 'test@gmail.com' } });
    fireEvent.submit(screen.getByTestId('login-form'));
    expect(() =>
      service.checkUser('test@gmail.com').toMatchObject(mockUserData)
    );
    expect(() => service.checkAuth('test@gmail.com').toBeTruthy());
  });
});
