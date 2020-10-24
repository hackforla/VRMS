import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import Footer from './footer';
import { BrowserRouter } from 'react-router-dom';

beforeEach(() => {
  render(<Footer />, { wrapper: BrowserRouter });
});
afterEach(cleanup);

describe('Footer', () => {
  test('Should render with text content', () => {
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(
      screen.getByText('was developed by Hack for LA')
    ).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('Should exist the tooltip', () => {
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('link')).toBeInTheDocument();
    expect(screen.getByTestId('link')).toHaveAttribute('href', '/page');
  });
});
