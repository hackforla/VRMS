import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/common/loader/loader';
import { Redirect } from 'react-router-dom';
import RedirectLink from '../common/link/link';
import allActions from '../../store/actions';

const HandleAuth = (props) => {
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const user = useSelector((state) => state.auth.user);
  const isLoaded = useSelector((state) => state.auth.isLoaded);
  const dispatch = useDispatch();

  useEffect(() => {
    const search = props.location.search;
    const params = new URLSearchParams(search);
    const token = params.get('token');
    dispatch(allActions.authActions.authUserWithToken(token));
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

export default HandleAuth;
