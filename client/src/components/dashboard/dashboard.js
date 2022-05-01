import React from 'react';
import Notifications from '../notifications/notifications';
import DashboardNav from './dashboardNav';
import { useUserContext } from "../auth";
import './dashboard.scss';

const Dashboard = () => {
  const [, appUser] = useUserContext();

  return (
    <div className="dashboard" data-testid="dashboard">
      <h2 className="user-name" data-testid="dash-user-name">
        Hi, {appUser.firstName}
      </h2>
      <Notifications />
      <DashboardNav />
    </div>
  );
};

export default Dashboard;
