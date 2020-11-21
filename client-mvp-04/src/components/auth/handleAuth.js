import React, { useEffect, useState } from 'react';
import { authUserWithToken } from '../../services/user.service';
import { connect } from 'react-redux';
import { loginFailed, loginSuccess } from '../../store/actions/authActions';
import { setUser } from '../../store/actions/userActions';
import RedirectLink from '../common/link/link';
import { useHistory } from 'react-router-dom';

const HandleAuth = (props) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  async function isValidToken() {
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const token = params.get('token');
    const user = await authUserWithToken(token);
    if (user) {
      props.dispatch(loginSuccess());
      props.dispatch(setUser(user));
      history.push('/dashboard');
      setIsLoading(true);
    } else {
      props.dispatch(loginFailed());
      setIsLoading(true);
    }
  }

  useEffect(() => {
    isValidToken().then();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    isLoading &&
    !props.loggedIn &&
    !props.user(
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
  );
};

const mapStateToProps = function (state) {
  return {
    loggedIn: state.auth.loggedIn,
    user: state.user.user,
  };
};

export default connect(mapStateToProps)(HandleAuth);
