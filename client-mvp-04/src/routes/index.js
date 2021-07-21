import Home from '../components/home/home';
import Dummy from '../components/dummy/dummy';
import Error from '../components/error/error';
import Login from '../components/login/loginContainer';
import Auth from '../components/auth/auth';
import HandleAuth from '../components/auth/handleAuth';
import ExpiredAuthSessionPage from '../components/auth/expiredAuthSessionPage';
import Dashboard from '../components/dashboard/dashboard';
import CreateAccountContainer from '../components/createAccount/createAccountContainer';
import CodeOfConduct from '../components/onboarding/codeOfConduct/codeOfConduct';
import EmailSetup from '../components/onboarding/emailSetup/emailSetup';
import Logout from '../components/logout/logout';

// For development only
import DevUiKit from '../utils/uiKit/uiKit';


export const Routes = [
  {
    path: '/',
    key: 'home',
    component: Home,
  },
  {
    path: '/logout',
    key: 'logout',
    component: Logout,
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
    path: '/auth/expired-session',
    key: 'expiredAuthSession',
    component: ExpiredAuthSessionPage,
  },
  {
    path: '/dashboard',
    key: 'dashboard',
    component: Dashboard,
  },
  {
    path: '/create-account',
    key: 'create-account',
    component: CreateAccountContainer,
  },
  {
    path: '/onboarding/email-setup',
    key: 'email-setup',
    component: EmailSetup,
  },
  {
    path: '/onboarding/code-of-conduct',
    key: 'code-of-conduct',
    component: CodeOfConduct,
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
