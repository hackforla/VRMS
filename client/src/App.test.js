import React from 'react';
import App from './App';
import { render, screen, cleanup } from '@testing-library/react';

beforeEach(() => {
  render(<App />);
});
afterEach(cleanup);

describe('App', () => {
  test('Should render and displays name of project', () => {
    const h1 = screen.getAllByText(/VRMS/i)[0];
    expect(h1).toBeInTheDocument();
  });
});
