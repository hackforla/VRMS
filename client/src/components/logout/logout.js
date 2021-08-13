import React, { useEffect } from 'react';
import './logout.scss';
import { useDispatch, useSelector } from 'react-redux';
import allActions from '../../store/actions';

const Logout = () => {
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(allActions.authActions.authLogout());
  }, [dispatch]);

  return (
    <section data-testid="logout-message" className="flex-container logout">
      {!loggedIn && (
        <h2 className="logout-content">You have been logged out.</h2>
      )}
    </section>
  );
};

export default Logout;
