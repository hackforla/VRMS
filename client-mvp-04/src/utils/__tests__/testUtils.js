import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import authReducer from '../../store/reducers/authReducer';

const history = createMemoryHistory();

const TestProvider = ({ store, children }) => (
  <Provider store={store}>
    <Router history={history}>{children}</Router>
  </Provider>
);

export function testRender(ui, { store, ...otherOpts }) {
  return render(<TestProvider store={store}>{ui}</TestProvider>, otherOpts);
}

export function createTestStore(opts = {}) {
  const mockStore = configureStore([]);
  return mockStore({
    auth: authReducer,
  });
}
