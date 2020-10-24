import Home from '../components/home/home';
import Dummy from '../components/dummy/dummy';
import Error from '../components/error/error';

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
