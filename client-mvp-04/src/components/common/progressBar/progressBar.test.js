import React from 'react';
import ProgressBar from './progressBar';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

describe('Progress Bar', () => {
  test('Should render component with items', () => {
    render(<ProgressBar total={6} active={1} />, {
      wrapper: BrowserRouter,
    });
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    expect(screen.getAllByTestId('progress-item').length).toEqual(6);
    expect(screen.getAllByTestId('progress-item')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('progress-item')[0]).toHaveClass(
      'progress-item active'
    );
    expect(screen.getAllByTestId('progress-item')[1]).not.toHaveClass('active');
  });
});
