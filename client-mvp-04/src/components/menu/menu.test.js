import React from 'react';
import 'react-redux';
import { screen } from '@testing-library/react';
import Menu from '../menu/menu';
import { useSelector } from 'react-redux';
import { userMockState } from '../../utils/__tests__/mocks/authMock';
import { testRender, createTestStore } from '../../utils/__tests__/testUtils';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

beforeEach(() => {
  useSelector.mockImplementation((callback) => {
    return callback(userMockState);
  });

  const store = createTestStore();
  testRender(<Menu />, { store });
});

afterEach(() => {
  useSelector.mockClear();
});

describe('Menu', () => {
  test('Should display menu if user logged in', () => {
    expect(screen.getByTestId('menu')).toBeInTheDocument();
  });
});
