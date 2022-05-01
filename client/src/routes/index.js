import Dummy from '../components/dummy/dummy';
import Error from '../components/error/error';
import Dashboard from '../components/dashboard/dashboard';
import CodeOfConduct from '../components/onboarding/codeOfConduct/codeOfConduct';
import EmailSetup from '../components/onboarding/emailSetup/emailSetup';
import HealthCheck from '../components/healthCheck/healthCheck';
import SignUpForm from "../components/signup/SignUp";

// For development only
import DevUiKit from '../utils/uiKit/uiKit';

export const Routes = [
  {
    path: '/',
    key: 'home',
    component: Dashboard,
  },
  {
    path: "/signup",
    key: "SignUpForm",
    component: SignUpForm
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
  { path: '/healthcheck', 
    key: 'healthcheck', 
    component: HealthCheck 
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
  }
];
