import React from 'react';
import 'react-redux';
import { fireEvent, screen } from '@testing-library/react';
import Dashboard from '../dashboard/dashboard';
import { useSelector } from 'react-redux';
import {
  userAuthSuccessMockState,
  userAuthFailMockState,
} from '../../utils/testUtils/mocks/authMock';
import {
  history,
  testRender,
  createTestStore,
} from '../../utils/testUtils/testUtils';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('Should display Dashboard if user authorized in app', () => {
  beforeEach(() => {
    useSelector.mockImplementation((callback) => {
      return callback(userAuthSuccessMockState);
    });

    const store = createTestStore();
    testRender(<Dashboard />, { store });
  });

  afterEach(() => {
    useSelector.mockClear();
  });

  test('Should display Dashboard if user logged in', () => {
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  test('Should display User Name', () => {
    expect(screen.getByTestId('dash-user-name')).toBeInTheDocument();
    expect(screen.getByTestId('dash-user-name')).toContainHTML(
      '<h2 class="user-name" data-testid="dash-user-name">Hi, Test</h2>'
    );
  });

  test('Should display Notifications section', () => {
    expect(screen.getByTestId('notifications')).toBeInTheDocument();
    expect(screen.getByTestId('checkin-btn')).toBeInTheDocument();
  });

  test('Should display 3 nav items for accessLevel: "user" and redirect to the dummy page', () => {
    expect(screen.getByTestId('dash-profile-item')).toBeInTheDocument();
    expect(screen.getByTestId('dash-profile-item')).toHaveAttribute(
      'href',
      '/page'
    );
    expect(screen.getByTestId('dash-projects-item')).toBeInTheDocument();
    expect(screen.getByTestId('dash-projects-item')).toHaveAttribute(
      'href',
      '/page'
    );
    expect(screen.getByTestId('dash-community-item')).toBeInTheDocument();
    expect(screen.getByTestId('dash-community-item')).toHaveAttribute(
      'href',
      '/page'
    );
  });

  test('Should not display "Admin Tools", "Team Join Requests" items for accessLevel: "user"', () => {
    expect(screen.queryByTestId('dash-team-item')).toBeFalsy();
    expect(screen.queryByTestId('dash-admin-tools-item')).toBeFalsy();
  });

  test('Dashboard item should contain icon', () => {
    expect(screen.getByTestId('dash-profile-item')).toContainElement(
      screen.getByTestId('item-icon')
    );
  });

  test('Should redirect to dummy page if click on "Profile" menu item', () => {
    expect(screen.getByTestId('dash-profile-item')).toHaveAttribute(
      'href',
      '/page'
    );
    fireEvent.click(screen.getByTestId('dash-profile-item'));
    expect(history.location.pathname).toBe('/page');
  });
});

describe('Should display dashboard items for accessLevel: "admin"', () => {
  beforeEach(() => {
    userAuthSuccessMockState.auth.userProfile.isAdmin = true;
    useSelector.mockImplementation((callback) => {
      return callback(userAuthSuccessMockState);
    });

    const store = createTestStore();
    testRender(<Dashboard />, { store });
  });

  afterEach(() => {
    useSelector.mockClear();
  });

  test('Should display "Admin Tools", "Team Join Requests" items for accessLevel: "admin"', () => {
    expect(screen.queryByTestId('dash-team-item')).toBeInTheDocument();
    expect(screen.queryByTestId('dash-admin-tools-item')).toBeInTheDocument();
  });
});

describe('Should not display Dashboard if user not authorized', () => {
  beforeEach(() => {
    useSelector.mockImplementation((callback) => {
      return callback(userAuthFailMockState);
    });

    const store = createTestStore();
    testRender(<Dashboard />, { store });
  });

  afterEach(() => {
    useSelector.mockClear();
  });

  test('Should not display Dashboard', () => {
    expect(screen.queryByTestId('dashboard')).toBeFalsy();
  });
});
