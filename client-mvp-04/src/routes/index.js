import Home from '../components/home';
import Dummy from '../components/dummy';
import Error from '../components/error';

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
    key: 'error',
    component: Error,
  },
];
