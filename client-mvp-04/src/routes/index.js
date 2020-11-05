import Home from '../components/home/home';
import Dummy from '../components/dummy/dummy';
import Error from '../components/error/error';
import Register from '../components/register/register'; 

import DevUiKit from '../utils/uiKit/uiKit';

export const Routes = [
  {
    path: '/',
    key: 'home',
    component: Home,
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
    path: '/register',
    key: 'create-account-link',
    component: Register,
  },
  {
    key: 'error',
    component: Error,
  },
];
