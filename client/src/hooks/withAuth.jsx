import { Navigate } from 'react-router-dom';
import useAuth from './useAuth';

const withAuth = (Component) => (props) => {
  const { auth } = useAuth();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return <Component {...props} auth={auth} />;
};

export default withAuth;
