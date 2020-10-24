import React from 'react';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  render(<App />);
});
afterEach(cleanup);

describe('App', () => {
  test('Should render and displays name of project', () => {
    const h2 = screen.getByText(/Volunteer Relationship Management System/i);
    expect(h2).toBeInTheDocument();
  });

  test('Should render with header and logo', () => {
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  test('Should render with main section', () => {
    expect(screen.getByTestId('main')).toBeInTheDocument();
  });

  test('Should exist `sign in` and `create account` buttons', () => {
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Create account')).toBeInTheDocument();
  });

  test('Should navigate to the dummy page after click on `Sign in`', () => {
    fireEvent.click(screen.getByText('Sign in'));
    expect(
      screen.getByText('Sorry, this functionality is not implemented yet.')
    ).toBeInTheDocument();
  });

  test('Should render with footer', () => {
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(
      screen.getByText('was developed by Hack for LA')
    ).toBeInTheDocument();
  });
});
