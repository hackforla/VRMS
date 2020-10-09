import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders App.js and header is present on the page', () => {
  const { getByText } = render(<App />);
  const h1 = getByText(/VRMS/i);
  expect(h1).toBeInTheDocument();
});
