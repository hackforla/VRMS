import React from 'react';
import ErrorMessage from './errorMessage';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

describe('Error Message', () => {
  test('Should render with text content and className', () => {
    render(<ErrorMessage content={'Test content'} />, {
      wrapper: BrowserRouter,
    });
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveClass('error-message');
  });
});
