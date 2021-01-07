import React from 'react';
import './dashboard.scss';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Notifications from '../notifications/notifications';

const Dashboard = () => {
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const user = useSelector((state) => state.auth.user);
  const userProfile = useSelector((state) => state.auth.userProfile);

  return loggedIn && user ? (
    <div className="dashboard">
      <h2>Hi, {userProfile.firstName}</h2>
      <Notifications />
    </div>
  ) : (
    <Redirect to="/auth/expired-session" />
  );
};

export default Dashboard;
