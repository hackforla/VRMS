import React from 'react';
import Error from './error';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

afterEach(cleanup);

describe('Error', () => {
  test('Should render with text content', () => {
    render(<Error />, { wrapper: BrowserRouter });
    expect(screen.getByTestId('error')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Oops! Page not found!')).toBeInTheDocument();
  });

  test("Should open error page if route doesn't exist", () => {
    const history = createMemoryHistory();
    history.push('/some/wrong/route');
    render(
      <Router history={history}>
        <Error />
      </Router>
    );
    expect(screen.getByText('Oops! Page not found!')).toBeInTheDocument();
  });

  test('Should navigate to home page after click on the link', () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <Error />
      </Router>
    );
    expect(screen.getByText('Oops! Page not found!')).toBeInTheDocument();
    expect(screen.getByTestId('link')).toHaveTextContent('Go to Homepage');
    expect(screen.getByTestId('link')).toHaveAttribute('href', '/');
    fireEvent.click(screen.getByTestId('link'));
    expect(history.location.pathname).toBe('/');
  });
});
