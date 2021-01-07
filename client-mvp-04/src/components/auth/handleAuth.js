import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { authUserWithToken } from '../../store/actions/authActions';
import Loader from '../../components/common/loader/loader';
import { Redirect } from 'react-router-dom';
import RedirectLink from '../common/link/link';

const HandleAuth = (props) => {
  const { isLoaded, loggedIn, user, authUserWithToken } = props;

  useEffect(() => {
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const token = params.get('token');
    authUserWithToken(token);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return isLoaded ? (
    loggedIn && user ? (
      <Redirect to="/dashboard" />
    ) : (
      <div className="flex-container">
        <h2>Sorry, this link is not valid</h2>
        <RedirectLink
          linkKey={'auth-link'}
          path={'/'}
          className={'accent-link'}
          content={'Go to Homepage'}
        />
      </div>
    )
  ) : (
    <Loader />
  );
};

const mapStateToProps = (state) => {
  return {
    loggedIn: state.auth.loggedIn,
    user: state.auth.user,
    isLoaded: state.auth.isLoaded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authUserWithToken: (token) => dispatch(authUserWithToken(token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HandleAuth);
