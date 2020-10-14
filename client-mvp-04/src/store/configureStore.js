import { createStore } from 'redux';
import allReducers from '../reducers/index';

export default () => {
    // Store creation
    const store = createStore(
        allReducers, /* preloadedState, */
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    return store;
}
