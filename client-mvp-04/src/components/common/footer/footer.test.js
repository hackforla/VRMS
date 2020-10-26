import React from 'react';
import Footer from './footer';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { BrowserRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

afterEach(cleanup);

describe('Footer', () => {
  test('Should render with text content', () => {
    render(<Footer />, { wrapper: BrowserRouter });
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(
      screen.getByText('was developed by Hack for LA')
    ).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('Should exist the tooltip', () => {
    render(<Footer />, { wrapper: BrowserRouter });
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('link')).toBeInTheDocument();
    expect(screen.getByTestId('link')).toHaveAttribute('href', '/page');
  });

  test('Should navigate to dummy page after clicking on the link', () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <Footer />
      </Router>
    );
    expect(screen.getByTestId('link')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('link'));
    expect(history.location.pathname).toBe('/page');
  });
});
