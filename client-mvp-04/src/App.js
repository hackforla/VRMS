import React from 'react';
import './App.scss';
import Header from './components/header';

import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

const App = () => {
  const store = configureStore();
  return (
    <Provider store={store}>
      <div className="app">
        <div className="app-container">
          <Header />

          <main>
            <h1>VRMS</h1>
          </main>

          <footer></footer>
        </div>
      </div>
    </Provider>
  );
};

export default App;
