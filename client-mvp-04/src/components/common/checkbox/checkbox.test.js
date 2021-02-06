import React from 'react';
import Checkbox from './checkbox';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

describe('Checkbox', () => {
  test('Should render without props', () => {
    render(<Checkbox />);
  });

  test('Should render with props', () => {
    const props = {
      content: 'Test Checkbox',
      isChecked: false,
      className: 'test-checkbox',
    };
    const { getByTestId } = render(
      <Checkbox
        value={props.content}
        content={props.content}
        isChecked={props.isChecked}
        className={props.className}
      />
    );
    expect(getByTestId('checkbox').value).toBe('Test Checkbox');
    expect(getByTestId('checkbox').checked).toBe(false);
    expect(getByTestId('checkbox')).toHaveClass('test-checkbox');
  });

  // TODO: Write test simulating onClick event and ensure checked updates to true
});
