import { combineReducers } from 'redux';
import authReducer from './authReducer';
import userReducer from './userReducer';

const allReducers = combineReducers({
  auth: authReducer,
  user: userReducer,
});

export default allReducers;
