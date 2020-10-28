import Home from '../components/home/home';
import Dummy from '../components/dummy/dummy';
import Error from '../components/error/error';

import DevUiKit from '../utils/ui-kit/ui-kit';

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
    key: 'error',
    component: Error,
  },
];
