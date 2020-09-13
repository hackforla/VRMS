import React, { useEffect } from 'react';

import useAuth from '../hooks/useAuth';

import '../sass/MagicLink.scss';
import { Redirect } from 'react-router-dom';

const HandleAuth = (props) => {

    const auth = useAuth();

    useEffect(() => {
        // Firebase.login();

    }, [auth]);

    return (
        <div className="flex-container">
            <div>
                <p>Redirecting...</p>
            </div>
            {auth.user && <Redirect to="/admin" />}
        </div>
    )
};

export default HandleAuth; 