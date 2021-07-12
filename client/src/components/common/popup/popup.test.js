import React from 'react';
import Popup from './popup';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

describe('Popup', () => {
  /**
   * Mock data
   */
  const closePopup = () => {
    props.isPopupOpen = false;
  };

  const props = {
    content: 'Test popup content',
    isPopupOpen: true,
    closePopup: closePopup,
  };

  test('Should render component without props', () => {
    render(<Popup />);
  });

  test('Should render component with props and open popup', () => {
    const { getByTestId } = render(
      <Popup
        content={props.content}
        isPopupOpen={props.isPopupOpen}
        closePopup={props.closePopup}
      />
    );

    expect(getByTestId('popup-container')).toHaveClass('open');
    expect(getByTestId('popup-container')).toHaveTextContent(
      'Test popup content'
    );
    expect(getByTestId('bg-overlay')).toHaveClass('active');
  });

  test('Should rerender component with closed popup', () => {
    closePopup();

    const { getByTestId } = render(
      <Popup
        content={props.content}
        isPopupOpen={props.isPopupOpen}
        closePopup={props.closePopup}
      />
    );

    expect(getByTestId('popup-container')).not.toHaveClass('open');
    expect(getByTestId('bg-overlay')).not.toHaveClass('active');
  });
});
