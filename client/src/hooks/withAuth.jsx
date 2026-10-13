import { Redirect } from 'react-router-dom';
import useAuth from './useAuth';

const withAuth = (Component) => (props) => {
    const { auth } = useAuth();

    if (!auth) {
        return <Redirect to="/login" />
    }

    return <Component {...props} auth={auth} />;
}

export default withAuth;