import React from 'react';
import './App.scss';
import Header from './components/header';
import Footer from './components/footer';
import Main from './components/main';

import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

const App = () => {
  const store = configureStore();
  return (
    <Provider store={store}>
      <div className="app">
        <div className="app-container">
          <Header />

          <Main />

          <Footer />
        </div>
      </div>
    </Provider>
  );
};

export default App;
