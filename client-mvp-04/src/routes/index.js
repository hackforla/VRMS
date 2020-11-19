import Home from '../components/home/home';
import Dummy from '../components/dummy/dummy';
import Error from '../components/error/error';
import Login from '../components/login/loginContainer';
import Auth from '../components/auth/auth';
import HandleAuth from '../components/auth/handleAuth';
import Dashboard from '../components/dashboard/dashboard';

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
