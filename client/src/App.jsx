import { Box, ThemeProvider } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/admin/dashboard';
import Auth from './components/auth/Auth';
import HandleAuth from './components/auth/HandleAuth';
import Footer from './components/Footer';
import addProject from './components/manageProjects/addProject';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/authContext';
import { FeatureFlagProvider } from './context/featureFlagsContext';
import CheckInForm from './pages/CheckInForm';
import EmailSent from './pages/EmailSent';
import Event from './pages/Event';
import Events from './pages/Events';
import HealthCheck from './pages/HealthCheck';
import Home from './pages/Home';
import ManageProjects from './pages/ManageProjects';
import NewUser from './pages/NewUser';
import OnboardOffboardVisibility from './pages/OnboardOffboardVisibility';
import ProjectLeaderDashboard from './pages/ProjectLeaderDashboard';
import ProjectList from './pages/ProjectList';
import ReturningUser from './pages/ReturningUser';
import SecretPassword from './pages/SecretPassword';
import Success from './pages/Success';
import UserAdmin from './pages/UserAdmin';
import UserDashboard from './pages/UserDashboard';
import UserPermission from './pages/UserPermission';
import UserProfile from './pages/UserProfile';
import Users from './pages/Users';
import UserWelcome from './pages/UserWelcome';
import theme from './theme';
import './App.scss';

import { SearchTextProvider } from './context/searchContext';
/* 
   withAuth Hook
   Wraps component with withAuth hook to manage automatic redirect to login page if user is not logged in
   An example (inside routes object):
   { path: '/endpoint', name: 'endpoint', Component: withAuth(ComponentName) },
   Return <Navigate to="/login" replace /> if user is not logged in
   Return <ComponentName {...props} auth={auth} /> if user is logged in
*/
import withAuth from './hooks/withAuth';

const routes = [
  { path: '/', name: 'home', Component: Home },
  { path: '/admin', name: 'admindashboard', Component: withAuth(AdminDashboard) },
  { path: '/user', name: 'userdashboard', Component: UserDashboard },
  { path: '/profile', name: 'profile', Component: UserProfile },
  { path: '/event/:id', name: 'event', Component: Event },
  { path: '/new', name: 'new', Component: NewUser },
  { path: '/returning', name: 'returning', Component: ReturningUser },
  { path: '/login', name: 'login', Component: Auth },
  { path: '/checkIn/:userType', name: 'checkIn', Component: CheckInForm },
  { path: '/newProfile', name: 'newProfile', Component: CheckInForm },
  { path: '/success', name: 'success', Component: Success },
  { path: '/handleauth', name: 'handleauth', Component: HandleAuth },
  { path: '/emailsent', name: 'emailsent', Component: EmailSent },
  { path: '/events', name: 'events', Component: withAuth(Events) },
  { path: '/useradmin', name: 'useradmin', Component: withAuth(UserAdmin) },
  { path: '/projects', name: 'projects', Component: withAuth(ProjectList) },
  { path: '/projects/create', name: 'projectform', Component: withAuth(addProject) },
  { path: '/users', name: 'users', Component: Users },
  { path: '/users/user-search', name: 'useradmin', Component: withAuth(UserAdmin) },
  {
    path: '/users/permission-search',
    name: 'useradmin',
    Component: withAuth(UserPermission),
  },
  {
    path: '/projects/visibility',
    name: 'onboardoffboardvisibility',
    Component: withAuth(OnboardOffboardVisibility),
  },
  {
    path: '/projects/:projectId',
    name: 'project',
    Component: withAuth(ManageProjects),
  },
  {
    path: '/projectleader',
    name: 'pldashboard',
    Component: ProjectLeaderDashboard,
  },
  { path: '/healthcheck', name: 'healthcheck', Component: HealthCheck },
  {
    path: '/secretpassword',
    name: 'secretpassword',
    Component: SecretPassword,
  },
  { path: '/welcome', name: 'welcome', Component: UserWelcome },
];

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <SearchTextProvider>
          <FeatureFlagProvider>
            <Box
              sx={{
                height: '100%',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                maxHeight: '90vh',
                margin: '5vh 0',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  maxWidth: '500px',
                  width: '100%',
                  backgroundColor: 'white',
                  overflow: 'hidden',
                  borderRadius: '10px',
                  padding: '15px',
                }}
              >
                <Navbar />
                <Box
                  component="main"
                  sx={{
                    height: 'calc(90vh - 160px)',
                    overflowY: 'scroll',
                  }}
                >
                  <Routes>
                    {routes.map(({ path, Component }) => (
                      <Route key={path} path={path} element={<Component />} />
                    ))}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Box>
                <Footer />
              </Box>
            </Box>
          </FeatureFlagProvider>
        </SearchTextProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
