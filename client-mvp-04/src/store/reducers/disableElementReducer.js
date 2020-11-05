import { ACTIVATE_EL, DISABLE_EL } from '../actions/types';

const elDefaultState = {
  disabled: true,
};

export default (state = elDefaultState, { type }) => {
  switch (type) {
    case ACTIVATE_EL:
      return {
        ...state,
        disabled: false,
      };
    case DISABLE_EL:
      return {
        ...state,
        disabled: true,
      };
    default:
      return state;
  }
};
