import React from 'react';
import 'react-redux';
import Footer from './footer';
import { screen, fireEvent } from '@testing-library/react';
import { useSelector } from 'react-redux';
import {
  authDefaultState,
  userAuthSuccessMockState,
  userAuthFailMockState,
} from '../../../utils/testUtils/mocks/authMock';
import {
  history,
  testRender,
  createTestStore,
} from '../../../utils/testUtils/testUtils';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('Should display main Footer for not authorized users', () => {
  beforeEach(() => {
    useSelector.mockImplementation((callback) => {
      return callback(authDefaultState);
    });

    const store = createTestStore();
    testRender(<Footer />, { store });
  });

  afterEach(() => {
    useSelector.mockClear();
  });

  test('Should render main Footer with text content', () => {
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(
      screen.getByText('was developed by Hack for LA')
    ).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('Should exist the tooltip', () => {
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('link')).toBeInTheDocument();
    expect(screen.getByTestId('link')).toHaveAttribute('href', '/page');
  });

  test('Should navigate to dummy page after clicking on the link', () => {
    expect(screen.getByTestId('link')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('link'));
    expect(history.location.pathname).toBe('/page');
  });

  test('Should not render Footer for authorized users', () => {
    expect(screen.queryByTestId('footer-logged-in')).toBeFalsy();
  });
});

describe('Should display Footer for authorized users', () => {
  beforeEach(() => {
    useSelector.mockImplementation((callback) => {
      return callback(userAuthSuccessMockState);
    });

    const store = createTestStore();
    testRender(<Footer />, { store });
  });

  afterEach(() => {
    useSelector.mockClear();
  });

  test('Should render Footer for authorized users', () => {
    expect(screen.getByTestId('footer-logged-in')).toBeInTheDocument();
    expect(screen.getByTestId('footer-logged-in')).toContainHTML(
      '<div class="text-block">Logged in as test@gmail.com</div>'
    );
  });

  test('Should not render main Footer', () => {
    expect(screen.queryByTestId('footer')).toBeFalsy();
  });
});

describe('Should display the main Footer if authorization fails', () => {
  beforeEach(() => {
    useSelector.mockImplementation((callback) => {
      return callback(userAuthFailMockState);
    });

    const store = createTestStore();
    testRender(<Footer />, { store });
  });

  afterEach(() => {
    useSelector.mockClear();
  });

  test('Should render main Footer with text content', () => {
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(
      screen.getByText('was developed by Hack for LA')
    ).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('Should not render Footer for authorized users', () => {
    expect(screen.queryByTestId('footer-logged-in')).toBeFalsy();
  });
});
