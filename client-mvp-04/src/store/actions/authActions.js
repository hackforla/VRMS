import { AUTH_START, AUTH_SUCCESS, AUTH_FAIL, SET_USER } from './types';
import { HEADERS, AUTH_VERIFY_SIGN_IN } from '../../utils/endpoints.js';

export const authStart = () => ({ type: AUTH_START });

export const authSuccess = (authToken, user) => ({
  type: AUTH_SUCCESS,
  payload: {
    user: user,
    authToken: authToken,
  },
});
export const authFail = (error) => ({ type: AUTH_FAIL, payload: error });

export const getUserWithToken = (token) => {
  return async (dispatch) => {
    dispatch(authStart);
    try {
      const response = await fetch(AUTH_VERIFY_SIGN_IN, {
        method: 'POST',
        headers: { ...HEADERS, 'x-access-token': token },
      });
      const user = await response.json();
      dispatch(authSuccess(token, user));
    } catch (error) {
      console.log('User is not authorized with token');
      console.log(error);
      dispatch(authFail(error.message));
    }
  };
};

export const setUser = (user) => ({ type: SET_USER, payload: user });
