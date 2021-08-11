import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

export default () => {
  const middleware = applyMiddleware(thunk);
  const enhancers = [middleware];
  const composedEnhancers = composeWithDevTools(...enhancers);
  return createStore(rootReducer, composedEnhancers);
};
