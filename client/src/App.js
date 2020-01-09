import React from 'react';
import { Route } from 'react-router-dom';

import Home from './pages/Home';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Event from './pages/Event';
import NewUser from './pages/NewUser';
import ReturningUser from './pages/ReturningUser';
import AdminLogin from './pages/AdminLogin';
import CheckInForm from './pages/CheckInForm';
import MagicLink from './pages/MagicLink';

import './App.scss';

const routes = [
	{ path: '/', name: 'home', Component: Home },
	{ path: '/admin', name: 'admindashboard', Component: AdminDashboard },
	{ path: '/user', name: 'userdashboard', Component: UserDashboard },
	{ path: '/event/:id', name: 'event', Component: Event },
	{ path: '/new', name: 'new', Component: NewUser },
	{ path: '/returning', name: 'returning', Component: ReturningUser },
	{ path: '/login', name: 'login', Component: AdminLogin },
	{ path: '/checkIn/:userType', name: 'checkIn', Component: CheckInForm },
	{ path: '/magicLink', name: 'magicLink', Component: MagicLink },
	
];

function App() {
  return (
    <div className="app">
		<div className="app-container">
			<Navbar />
			<main role="main" className="main">
				{routes.map(({ path, Component }) => (
					<Route key={path} exact path={path} component={Component} />
				))}
			</main>
		</div>
    </div>
  );
}

export default App;
