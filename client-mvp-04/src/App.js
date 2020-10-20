import React from 'react';
import './App.scss';
import Header from './components/header';
import Footer from './components/footer';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Routes } from './routes';

const App = () => {
  const store = configureStore();
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <div className="app-container">
            <Header />

            <main role="main" className="app-main">
              <Switch>
                {Routes.map(({ path, key, component }) => (
                  <Route key={key} path={path} component={component} exact />
                ))}
              </Switch>
            </main>

            <Footer />
          </div>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
