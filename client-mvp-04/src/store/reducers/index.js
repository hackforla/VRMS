import authReducer from './authReducer';
import { combineReducers } from 'redux';
import { RESET_STATE } from '../actions/types';

const allReducers = combineReducers({
  auth: authReducer,
});

const rootReducer = (state, action) => {
  // Reset all data in redux store to initial
  if (action.type === RESET_STATE) state = undefined;
  return allReducers(state, action);
};

export default rootReducer;
