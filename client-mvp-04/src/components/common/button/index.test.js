import React from 'react';
import Button from './index';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

describe('Button', () => {
  test('Should render without props', () => {
    render(<Button />);
  });

  test('Should render with props', () => {
    const props = {
      content: 'Test Button',
      className: 'test-button',
    };
    const { getByTestId } = render(
      <Button content={props.content} className={props.className} />
    );
    expect(getByTestId('button')).toHaveTextContent('Test Button');
    expect(getByTestId('button')).toHaveClass('test-button');
  });
});
