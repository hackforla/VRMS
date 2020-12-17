import Home from '../components/home/home';
import Dummy from '../components/dummy/dummy';
import Error from '../components/error/error';
import Login from '../components/login/loginContainer';
import Auth from '../components/auth/auth';
import HandleAuth from '../components/auth/handleAuth';
import Dashboard from '../components/dashboard/dashboard';
import CreateAccountContainer from '../components/createAccount/createAccountContainer';
import Menu from '../components/menu/menu';

import DevUiKit from '../utils/uiKit/uiKit';

export const Routes = [
  {
    path: '/',
    key: 'home',
    component: Home,
  },
  {
    path: '/login',
    key: 'login',
    component: Login,
  },
  {
    path: '/login/auth',
    key: 'auth',
    component: Auth,
  },
  {
    path: '/handleauth',
    key: 'handleauth',
    component: HandleAuth,
  },
  {
    path: '/dashboard',
    key: 'dashboard',
    component: Dashboard,
  },
  {
    path: '/page',
    key: 'dummy',
    component: Dummy,
  },
  {
    path: '/create-account',
    key: 'create-account',
    component: CreateAccountContainer,
  },
  {
    path: '/dashboard/menu',
    key: 'menu',
    component: Menu,
  },
  {
    // DEV-UI-KIT for Development Only
    path: '/dev-ui-kit',
    key: 'dev-ui-kit',
    component: DevUiKit,
  },
  {
    key: 'error',
    component: Error,
  },
];
