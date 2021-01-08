import React from 'react';
import './dashboard.scss';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Notifications from '../notifications/notifications';
import DashboardNav from './dashboardNav';

const Dashboard = () => {
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const userProfile = useSelector((state) => state.auth.userProfile);

  return loggedIn && userProfile ? (
    <div className="dashboard">
      <h2 className="user-name">Hi, {userProfile.firstName}</h2>
      <Notifications />
      <DashboardNav />
    </div>
  ) : (
    <Redirect to="/auth/expired-session" />
  );
};

export default Dashboard;
