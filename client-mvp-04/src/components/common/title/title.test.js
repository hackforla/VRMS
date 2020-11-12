import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Title from './title';

describe('ProjectTitle', () => {
  test('Should render component with name of project', () => {
    render(<Title />, { wrapper: BrowserRouter });
    expect(screen.getByTestId('title')).toBeInTheDocument();
    const h1 = screen.getByText(/VRMS/i);
    const h2 = screen.getByText(/Volunteer Relationship Management System/i);
    expect(h1).toBeInTheDocument();
    expect(h2).toBeInTheDocument();
  });
});
