import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

import '../sass/MagicLink.scss';
import { Redirect } from 'react-router-dom';

const HandleAuth = (props) => {

    const auth = useAuth();

    useEffect(() => {
        console.log(auth);
        // fetchData();
        // let timer = setTimeout(() => {
        //     props.history.push('/');
        // }, 6000);

        // return () => clearTimeout(timer);
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