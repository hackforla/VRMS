import React from 'react';
import { AuthProvider } from './context/authContext';
import { Route, Redirect, Switch } from 'react-router-dom';

import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminDashboard from './components/admin/dashboard';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import Event from './pages/Event';
import NewUser from './pages/NewUser';
import ReturningUser from './pages/ReturningUser';
import Auth from './components/auth/Auth';
import CheckInForm from './pages/CheckInForm';
import Success from './pages/Success';
import HandleAuth from './components/auth/HandleAuth';
import EmailSent from './pages/EmailSent';
import Events from './pages/Events';
import ProjectLeaderDashboard from './pages/ProjectLeaderDashboard';
import Users from './pages/Users';
import UserAdmin from './pages/UserAdmin';
import ProjectList from './pages/ProjectList';
import ManageProjects from './pages/ManageProjects';
import addProject from './components/manageProjects/addProject';
import HealthCheck from './pages/HealthCheck';
import SecretPassword from './pages/SecretPassword';
import UserWelcome from './pages/UserWelcome';
import UserPermission from './pages/UserPermission';

import { ThemeProvider } from '@mui/material';
import theme from './theme';

import './App.scss';

const routes = [
  { path: '/', name: 'home', Component: Home },
  { path: '/admin', name: 'admindashboard', Component: AdminDashboard },
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
  { path: '/events', name: 'events', Component: Events },
  { path: '/users', name: 'users', Component: Users },

  { path: '/users/user-search', name: 'useradmin', Component: UserAdmin },
  {
    path: '/users/permission-search',
    name: 'useradmin',
    Component: UserPermission,
  },
  { path: '/projects', name: 'projects', Component: ProjectList },
  { path: '/projects/create', name: 'projectform', Component: addProject },
  {
    path: '/projects/:projectId',
    name: 'project',
    Component: ManageProjects,
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
        <div className="app">
          <div className="app-container">
            <Navbar />
            <main role="main" className="main">
              <Switch>
                {routes.map(({ path, Component }) => (
                  <Route key={path} exact path={path} component={Component} />
                ))}
                <Redirect to="/" />
              </Switch>
            </main>
            <Footer />
          </div>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
