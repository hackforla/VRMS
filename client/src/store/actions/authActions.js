import { AUTH_START, AUTH_SUCCESS, AUTH_FAIL, SET_USER, AUTH_LOGOUT } from './types';
import { HEADERS, AUTH_VERIFY_SIGN_IN } from '../../utils/endpoints.js';

const authStart = () => ({ type: AUTH_START });

const authSuccess = (authToken, authOrigin, user) => ({
  type: AUTH_SUCCESS,
  payload: {
    user: user,
    authToken: authToken,
    authOrigin: authOrigin,
  },
});

const authFail = (error) => ({ type: AUTH_FAIL, payload: error });

const authUserWithToken = (token, auth_origin) => {
  return async (dispatch) => {
    dispatch(authStart);
    try {
      const response = await fetch(AUTH_VERIFY_SIGN_IN, {
        method: 'POST',
        headers: { ...HEADERS, 'x-access-token': token },
      });
      const user = await response.json();
      dispatch(authSuccess(token, auth_origin, user));
    } catch (error) {
      console.log('User is not authorized with token');
      console.log(error);
      dispatch(authFail(error.message));
    }
  };
};

const setUser = (user) => ({ type: SET_USER, payload: user });

const authLogout = () => ({type: AUTH_LOGOUT})

export default {
  authStart,
  authSuccess,
  authFail,
  authUserWithToken,
  setUser,
  authLogout
};
