import React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import Home from './home';
import { BrowserRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

afterEach(cleanup);

describe('Home', () => {
  test('Should render component with name of project', () => {
    render(<Home />, { wrapper: BrowserRouter });
    expect(screen.getByTestId('home')).toBeInTheDocument();
    const h1 = screen.getByText(/VRMS/i);
    const h2 = screen.getByText(/Volunteer Relationship Management System/i);
    expect(h1).toBeInTheDocument();
    expect(h2).toBeInTheDocument();
  });

  test('Should exist `sign in` and `create account` buttons', () => {
    render(<Home />, { wrapper: BrowserRouter });
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Create account')).toBeInTheDocument();
  });

  test('Should navigate to dummy page after click on `Sign in` button', () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <Home />
      </Router>
    );
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getAllByTestId('link')[0]).toHaveAttribute('href', '/login');
    fireEvent.click(screen.getAllByTestId('link')[0]);
    expect(history.location.pathname).toBe('/login');
  });

  test('Should navigate to create account page after click on `Create account` button', () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <Home />
      </Router>
    );
    expect(screen.getByText('Create account')).toBeInTheDocument();
    expect(screen.getAllByTestId('link')[1]).toHaveAttribute('href', '/create-account');
    fireEvent.click(screen.getAllByTestId('link')[1]);
    expect(history.location.pathname).toBe('/create-account');
  });
});
