import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

import '../sass/MagicLink.scss';

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
            {auth && auth.user}
        </div>
    )
};

export default HandleAuth; 