import { LOGIN_SUCCESS, LOGIN_FAIL } from './types';

export const loginSuccess = () => ({ type: LOGIN_SUCCESS });
export const loginFailed = () => ({ type: LOGIN_FAIL });
