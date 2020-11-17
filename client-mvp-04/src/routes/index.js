import Home from '../components/home/home';
import Dummy from '../components/dummy/dummy';
import Error from '../components/error/error';
import CreateAccountContainer from '../components/createAccount/createAccountContainer'; 
import LoginContainer from '../components/login/loginContainer';

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
    component: LoginContainer,
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
    path: '/create-account',
    key: 'create-account',
    component: CreateAccountContainer,
  },
  {
    key: 'error',
    component: Error,
  },
];
