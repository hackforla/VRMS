import React from 'react';
import './App.scss';
import Header from './components/common/header/header';
import Menu from './components/menu/menu';
import Footer from './components/common/footer/footer';
import { Provider } from 'react-redux';
import configureStore from './store/store';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Routes } from './routes';
import { AuthorizedRedirect, withAwsAuth } from "./components/auth"

const App = () => {
  const store = configureStore();

  return (
    <Provider store={store}>
      <Router>
        <AuthorizedRedirect>
          <div className="app">
            <div className="app-container">
              <Header />
              <Menu />
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
        </AuthorizedRedirect>
      </Router>
    </Provider>
  );
};

export default withAwsAuth(App);
