import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './header';
import { BrowserRouter } from 'react-router-dom';

describe('Header', () => {
  test('Should render with logo', () => {
    render(<Header />, { wrapper: BrowserRouter });
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('link')).toHaveAttribute('href', '/');
  });
});
