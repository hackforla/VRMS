import React from 'react';
import Header from './header';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import dashboardReducer from '../../../store/reducers/dashboardReducer';
import authReducer from '../../../store/reducers/authReducer';

// Mock Redux Store
const mockStore = configureStore([]);
let store = mockStore({
  auth: authReducer,
  dashboard: dashboardReducer,
});
store.dispatch = jest.fn();

beforeEach(() => {
  const history = createMemoryHistory();
  render(
    <Provider store={store}>
      <Router history={history}>
        <Header />
      </Router>
    </Provider>
  );
});

afterEach(cleanup);

describe('Header', () => {
  test('Should render with logo', () => {
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('link')).toHaveAttribute('href', '/');
  });

  test('Should navigate to home page after clicking on the logo', () => {
    const history = createMemoryHistory();
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('link')).toHaveAttribute('href', '/');
    fireEvent.click(screen.getByTestId('logo'));
    expect(history.location.pathname).toBe('/');
  });
});
