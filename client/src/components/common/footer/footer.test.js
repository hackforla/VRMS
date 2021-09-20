import React from 'react';
import { render, screen } from '@testing-library/react';

import * as UserContext from "../../auth/UserContext";
import Footer from './footer';

const userContextMock = jest
  .spyOn(UserContext, 'useUserContext')
  .mockImplementation(() => {
    const awsUser = {
      attributes: {
        email: "test@gmail.com"
      }
    };
    const appUser = {};
    const state = "loaded";
    const refreshFunc = () => {};
    return [awsUser, appUser, state, refreshFunc];
  });


describe('Should display Footer for authorized users', () => {
  beforeEach(() => {
    render(<Footer />)
  });

  test('Should render Footer for authorized users', () => {
    expect(screen.getByTestId('footer-logged-in')).toBeInTheDocument();
    expect(screen.getByTestId('footer-logged-in')).toContainHTML(
      '<div class="text-block">Logged in as test@gmail.com'
    );
  });
});
