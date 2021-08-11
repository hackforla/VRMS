import React from 'react';
import Checkbox from './checkbox';
import { render, cleanup, fireEvent } from '@testing-library/react';

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

  test('Should change checked property of hidden checkbox to true when custom checkbox component is clicked', () => {
    const props = {
      content: 'Test Checkbox',
      className: 'test-checkbox',
    };
    const { getByTestId } = render(
      <Checkbox
        value={props.content}
        content={props.content}
        className={props.className}
      />
    );

    const hiddenCheckbox = document.getElementsByTagName('input')[0];
    const fauxCheckbox = getByTestId('checkbox');

    expect(hiddenCheckbox.checked).toBe(false);
    fireEvent.click(fauxCheckbox);
    expect(hiddenCheckbox.checked).toBe(true);
  });
});
