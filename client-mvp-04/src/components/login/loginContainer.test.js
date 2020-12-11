import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LoginContainer from './loginContainer';
import { MemoryRouter } from 'react-router-dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import authReducer from '../../store/reducers/authReducer';
import service from '../../services/user.service';

// Mock Redux Store
const mockStore = configureStore([]);
let store = mockStore({
  auth: authReducer,
});
store.dispatch = jest.fn();

// Mock UserService
const mockUserData = {
  name: { firstName: 'Test', lastName: 'Person' },
  accessLevel: 'user',
  skillsToMatch: [],
  projects: [],
  textingOk: false,
  _id: '5f4bfbc8e9f4f121e8c1eb42',
  email: 'test@gmail.com',
  currentRole: 'College Student',
  desiredRole: 'Software Developer',
  newMember: false,
  attendanceReason: 'Environment',
  currentProject: 'VRMS',
  createdDate: '2020-11-11T03:48:46.153Z',
};

jest.mock('../../services/user.service', () => jest.fn());
service.checkUser = jest.fn(() => {
  return mockUserData;
});
service.checkAuth = jest.fn(() => {
  return true;
});

beforeEach(() => {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/login']}>
        <LoginContainer />
      </MemoryRouter>
    </Provider>
  );
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
