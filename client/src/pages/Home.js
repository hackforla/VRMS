import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';


import '../sass/Home.scss';
// import '../sass/Home-media-queries.scss';

const Home = (props) => {

    useEffect(() => {
        // fetchData();

    }, []);

    return (
        <div className="flexcenter-container">
            <div className="home">
                <div className="home-headers">
                    <h1>VRMS</h1>
                    <h2>Volunteer Relationship Management System</h2>
                </div>

                <div className="home-buttons">
                    <Link className="home-button" to={'/new'}>New</Link>
                    <Link className="home-button" to={'/returning'}>Returning</Link>
                </div>
                 
                <div className="login-button">
                    <Link className="home-button" to={'/login'}>Login</Link>
                </div>
            </div>
        </div>
    )
};

export default Home;
    