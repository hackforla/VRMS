import React from 'react';
import './dashboard.scss';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const Dashboard = ({ loggedIn, user }) => {
  return loggedIn && user ? (
    <div className="flex-container dashboard">
      <h2>Hi {user.name.firstName},</h2>
      <br />
      <h2>Welcome to VRMS Dashboard!</h2>
    </div>
  ) : (
    <Redirect to="/" />
  );
};

const mapStateToProps = function (state) {
  return {
    loggedIn: state.auth.loggedIn,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps)(Dashboard);
