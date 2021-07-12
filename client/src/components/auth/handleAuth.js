import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/common/loader/loader';
import { Redirect } from 'react-router-dom';
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
    const auth_origin = params.get('auth_origin');
    dispatch(allActions.authActions.authUserWithToken(token, auth_origin));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return isLoaded ? (
    loggedIn && user ? (
      <Redirect to="/dashboard" />
    ) : (
      <Redirect to="/auth/expired-session" />
    )
  ) : (
    <Loader />
  );
};

export default HandleAuth;
