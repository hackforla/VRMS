import React from 'react';
import RedirectLink from './index';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

describe('RedirectLink', () => {
  test('Should render with props', () => {
    const { getByTestId } = render(
      <RedirectLink
        path={'/test-page'}
        key={'test-key'}
        content={'Test Link'}
        className={'test-link'}
      />,
      { wrapper: BrowserRouter }
    );

    expect(screen.getByTestId('link')).toBeInTheDocument();
    expect(getByTestId('link')).toHaveTextContent('Test Link');
    expect(getByTestId('link')).toHaveClass('redirect-link', 'test-link');
    expect(getByTestId('link')).toHaveAttribute('href', '/test-page');
  });
});
