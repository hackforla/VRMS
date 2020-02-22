import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';

import Firebase from '../firebase';

import useAuth from '../hooks/useAuth';

import '../sass/MagicLink.scss';
import { Redirect } from 'react-router-dom';

const HandleAuth = (props) => {

    const auth = useAuth();

    useEffect(() => {
        // Firebase.login();

    }, []);

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