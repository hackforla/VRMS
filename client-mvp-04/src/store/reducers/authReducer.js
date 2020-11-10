import { LOGIN_SUCCESS, LOGIN_FAIL } from '../actions/types';

const authDefaultState = {
  loggedIn: false,
};

export default (state = authDefaultState, { type }) => {
  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggedIn: false,
      };
    default:
      return state;
  }
};
