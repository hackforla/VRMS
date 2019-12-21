import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


import '../sass/Home.scss';
// import '../sass/Home-media-queries.scss';

const Home = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    // const [event, setEvent] = useState([]);
    const [isError, setIsError] = useState(null);

    // async function fetchData() {
    //     try {
    //         const res = await fetch(`http://localhost:4000/api/events/${props.match.params.id}`);
    //         const resJson = await res.json();
    //         setEvent(resJson);
    //     } catch(error) {
    //         setIsError(error);
    //         alert(error);
    //     }
    // }

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
                    <Link to={'/new'}>New</Link>
                    <Link to={'/returning'}>Returning</Link>
                </div>
                <div className="login-button">
                    <Link to={'/login'}>Login</Link>
                </div>
            </div>
        </div>
    )
};

export default Home;
    