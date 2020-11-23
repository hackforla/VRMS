import { SET_USER, FAIL_USER, GET_USER } from '../actions/types';

const userInitialState = {
  user: null,
};

export default (state = userInitialState, { type, payload }) => {
  switch (type) {
    case SET_USER:
      return {
        ...state,
        user: payload,
      };
    case FAIL_USER:
      return {
        ...state,
        user: null,
      };
    case GET_USER:
      return state;
    default:
      return state;
  }
};
