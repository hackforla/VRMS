import React from 'react';
import Header from './header';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

describe('Header', () => {
  test('Should render with logo', () => {
    render(<Header />, { wrapper: BrowserRouter });
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('link')).toHaveAttribute('href', '/');
  });

  test('Should navigate to home page after clicking on the logo', () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <Header />
      </Router>
    );
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('link')).toHaveAttribute('href', '/');
    fireEvent.click(screen.getByTestId('logo'));
    expect(history.location.pathname).toBe('/');
  });
});
