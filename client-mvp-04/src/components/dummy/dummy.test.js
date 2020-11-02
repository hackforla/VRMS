import React from 'react';
import { render, screen } from '@testing-library/react';
import Dummy from './dummy';
import { BrowserRouter } from 'react-router-dom';

describe('Dummy', () => {
  test('Should render with text content', () => {
    render(<Dummy />, { wrapper: BrowserRouter });
    expect(screen.getByTestId('dummy')).toBeInTheDocument();
    expect(
      screen.getByText('Sorry, this functionality is not implemented yet.')
    ).toBeInTheDocument();
  });
});
