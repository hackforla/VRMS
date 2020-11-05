import authReducer from './authReducer';
import disableElementReducer from './disableElementReducer';
import { combineReducers } from 'redux';
import { RESET_STATE } from '../actions/types';

const allReducers = combineReducers({
  auth: authReducer,
  element: disableElementReducer,
});

const rootReducer = (state, action) => {
  // Reset all data in redux store to initial
  if (action.type === RESET_STATE) state = undefined;
  return allReducers(state, action);
};

export default rootReducer;
