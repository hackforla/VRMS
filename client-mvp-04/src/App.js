import React, { useState } from 'react';
import './App.scss';
import Header from './components/common/header/header';
import Footer from './components/common/footer/footer';
import { Provider } from 'react-redux';
import configureStore from './store/store';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Routes } from './routes';
import Menu from './components/menu/menu';

const App = () => {
  const store = configureStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <div className="app-container">
            <Header toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />

            <Menu toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />

            <main data-testid="main" role="main" className="app-main">
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
