import React, { useEffect } from 'react';
import { authUserWithToken } from '../../services/user.service';
import { connect } from 'react-redux';
import { loginFailed, loginSuccess } from '../../store/actions/authActions';
import { getUser } from '../../services/user.service';
import { setUser } from '../../store/actions/userActions';
import RedirectLink from '../common/link/link';
import { useHistory } from 'react-router-dom';

const HandleAuth = (props) => {
  const history = useHistory();

  async function isValidToken() {
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const api_token = params.get('token');

    const isTokenValid = await authUserWithToken(api_token);
    if (isTokenValid) {
      props.dispatch(loginSuccess());
      history.push('/dashboard');
      // TODO need to save get user from API and save to store
      // TODO Blocked because currently don't have user or ser email when verify user with token
      //const userData = await getUser(email);
      //if (userData) props.dispatch(setUser(userData));
    } else {
      props.dispatch(loginFailed());
    }
  }

  useEffect(() => {
    isValidToken().then();
  }, []);

  return (
    <>
      {!props.loggedIn ? (
        <div className="flex-container">
          <h2>Sorry, this link is not valid</h2>
          <RedirectLink
            linkKey={'auth-link'}
            path={'/'}
            className={'accent-link'}
            content={'Go to Homepage'}
          />
        </div>
      ) : null}
    </>
  );
};

const mapStateToProps = function (state) {
  return {
    loggedIn: state.auth.loggedIn,
    user: state.user.user,
  };
};

export default connect(mapStateToProps)(HandleAuth);
