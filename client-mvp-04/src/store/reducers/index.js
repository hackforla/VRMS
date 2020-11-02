import authReducer from './authReducer';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    auth: authReducer
})

export default allReducers;
