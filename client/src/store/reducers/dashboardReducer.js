import { OPEN_MENU, CLOSE_MENU } from '../actions/types';

const dashboardInitialState = {
  isMenuOpen: false,
};

export default (state = dashboardInitialState, { type }) => {
  switch (type) {
    case OPEN_MENU:
      return {
        ...state,
        isMenuOpen: true,
      };
    case CLOSE_MENU:
      return {
        ...state,
        isMenuOpen: false,
      };
    default:
      return state;
  }
};
