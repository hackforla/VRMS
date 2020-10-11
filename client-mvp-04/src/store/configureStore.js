  
import { createStore, combineReducers } from 'redux';
import authReducer from '../reducers/authReducer';

export default () => {
    // Store creation
    const store = createStore(
        combineReducers({
            auth: authReducer,
        }), /* preloadedState, */
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    
    return store;
}