import React from 'react';
import Input from './input';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

describe('DefaultInput', () => {
  test('Should render with props', () => {
    const { getByTestId } = render(
      <Input type="text" placeholder="Some text" />,
      { wrapper: BrowserRouter }
    );

    expect(screen.getByTestId('default-input')).toBeInTheDocument();
    expect(getByTestId('default-input')).toHaveAttribute('type', 'text');
    expect(getByTestId('default-input')).toHaveAttribute(
      'name',
      'default-input'
    );
    expect(getByTestId('default-input')).toHaveAttribute(
      'placeholder',
      'Some text'
    );
  });
});
