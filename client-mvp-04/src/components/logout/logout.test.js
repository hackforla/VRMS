import React from 'react';
import { render, screen } from '@testing-library/react';
import Logout from './logout';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from '../../store/store';
import allActions from '../../store/actions';

const store = configureStore();

const AllProviders = ({ children }) => (
  <Provider store={store}>
    <BrowserRouter>{children}</BrowserRouter>
  </Provider>
);

describe('Logout', () => {
  test('Should render with text content', () => {
    render(<Logout />, { wrapper: AllProviders });
    expect(screen.getByTestId('logout-message')).toBeInTheDocument();
    expect(screen.getByText('You have been logged out.')).toBeInTheDocument();
  });

  test('Should issue expected dispatch', () => {
    const spy = jest.spyOn(store, 'dispatch');
    render(<Logout />, { wrapper: AllProviders });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenLastCalledWith(allActions.authActions.authLogout())
  });
});


