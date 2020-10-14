import { createStore } from 'redux';
import allReducers from '../reducers';

export default () => {
    const store = createStore(
        allReducers,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    return store;
}
