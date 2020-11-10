import { SET_USER, FAIL_USER } from './types';

export const setUser = (user) => ({ type: SET_USER, payload: user });
export const failUser = () => ({ type: FAIL_USER });
