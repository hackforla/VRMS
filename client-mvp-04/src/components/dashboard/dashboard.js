import React from 'react';
import './dashboard.scss';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const Dashboard = (props) => {
  return (
    <>
      {props.loggedIn ? (
        <div className="flex-container dashboard">
          <h2>Welcome to Dashboard!</h2>
        </div>
      ) : (
        <Redirect to="/" />
      )}
    </>
  );
};

const mapStateToProps = function (state) {
  return {
    loggedIn: state.auth.loggedIn,
    user: state.user.user,
  };
};

export default connect(mapStateToProps)(Dashboard);
