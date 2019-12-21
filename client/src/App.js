import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './pages/Home';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Event from './pages/Event';
import NewUser from './pages/NewUser';
import ReturningUser from './pages/ReturningUser';
import AdminLogin from './pages/AdminLogin';
import CheckIn from './pages/CheckIn';

import './App.scss';

const routes = [
	{ path: '/', name: 'home', Component: Home },
	{ path: '/dashboard', name: 'dashboard', Component: Dashboard },
	{ path: '/event/:id', name: 'event', Component: Event },
	{ path: '/new', name: 'new', Component: NewUser },
	{ path: '/returning', name: 'returning', Component: ReturningUser },
	{ path: '/login', name: 'login', Component: AdminLogin },
	{ path: '/checkIn/:userType', name: 'checkIn', Component: CheckIn }
];

// { path: '/events', name: 'events', Component: Events },

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
