import React from 'react';
import logo from './logo.svg';
import './App.scss';

import  { Provider } from 'react-redux';
import configureStore from './store/configureStore';

function App() {
  const store = configureStore();
  return (
    <Provider store={store}>
      <div className="app-container">
        <header className="app-header">
          <img src={logo} className="app-logo" alt="logo" />
          <h1>VRMS</h1>
        </header>
      </div>
    </Provider>
  );
}

export default App;
