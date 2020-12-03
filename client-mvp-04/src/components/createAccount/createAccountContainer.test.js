import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import CreateAccountContainer from './createAccountContainer';
import { MemoryRouter } from 'react-router-dom';
import { cleanup, fireEvent, render, screen, wait } from '@testing-library/react';
import userReducer from '../../store/reducers/userReducer';
import service from '../../services/user.service';

// Mock Redux Store
const mockStore = configureStore([]);
let store = mockStore({
    user: userReducer,
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

beforeEach(() => {
    render(
        <Provider store={store}>
            <MemoryRouter initialEntries={['/create-account']}>
                <CreateAccountContainer />
            </MemoryRouter>
        </Provider>
    );
});

afterEach(cleanup);

describe('CreateAccount Container', () => {
    describe('Create Account Button', () => {
        test('Should be disabled by default', () => {
            expect(screen.getByText('Create Account')).toBeDisabled();
        });

        test('Should be disabled when the input value only contains spaces', () => {
            const createAccountInput = screen.getByTestId('create-account-input');
            fireEvent.change(createAccountInput, { target: { value: ' ' } });
            expect(screen.getByText('Create Account')).toBeDisabled();
        });

        test('Should be enabled when the input value isn`t empty', () => {
            expect(screen.getByText('Create Account')).toBeDisabled();
            const createAccountInput = screen.getByTestId('create-account-input');
            fireEvent.change(createAccountInput, { target: { value: 't' } });
            expect(screen.getByText('Create Account')).not.toBeDisabled();
            fireEvent.change(createAccountInput, { target: { value: 'test' } });
            expect(screen.getByText('Create Account')).not.toBeDisabled();
        });
    });

    test('Should display error message if email invalid', () => {
        const createAccountInput = screen.getByTestId('create-account-input');
        expect(createAccountInput).toBeInTheDocument();
        fireEvent.change(createAccountInput, { target: { value: 'test@gmail.c' } });
        fireEvent.submit(screen.getByTestId('create-account-form'));
        expect(
            screen.getByText('*Please enter a valid email address')
        ).toBeInTheDocument();
    });

    test('Should get user from UserService if user registered in the app', async () => {
        const createAccountInput = screen.getByTestId('create-account-input');
        expect(createAccountInput).toBeInTheDocument();
        fireEvent.change(createAccountInput, { target: { value: 'test@gmail.com' } });
        fireEvent.submit(screen.getByTestId('create-account-form'));
        await wait(async () => {
            expect(() =>
                service.checkUser('test@gmail.com').toMatchObject(mockUserData)
            );
        });
    });

    test('Should display error message if user registered in the app', async () => {
        const createAccountInput = screen.getByTestId('create-account-input');
        expect(createAccountInput).toBeInTheDocument();
        fireEvent.change(createAccountInput, { target: { value: 'test@gmail.com' } });
        fireEvent.submit(screen.getByTestId('create-account-form'));
        await screen.findByTestId('registered-user-error-msg');
    });
});
