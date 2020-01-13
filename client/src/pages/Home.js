import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


import '../sass/Home.scss';
// import '../sass/Home-media-queries.scss';

const Home = (props) => {
    const [event, setEvent] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    async function fetchEvent() {
        try {
            setIsLoading(true);
            const res = await fetch("/api/events?checkInReady=true");
            const resJson = await res.json();

            setEvent(resJson);
            setIsLoading(false);
        } catch(error) {
            console.log(error);
            setIsLoading(false);
            // setIsError(error);
            // alert(error);
        }
    }

    useEffect(() => {
        fetchEvent();

    }, []);

    return (
        <div className="flexcenter-container">
            <div className="home">
                {/* <div class="rotated-home"></div> */}
                <div className="home-headers">
                    <h1>VRMS</h1>
                    <h2>Volunteer Relationship Management System</h2>
                </div>

                <div className="home-buttons">
                    {event.length !== 0 && event.map(event => {
                        return (
                            <Link 
                                to={`/checkIn/newUser?eventId=${event._id}`} 
                                key={event._id} 
                                className="home-button">
                                    CHECK IN NEW USER
                            </Link>
                        )
                    })}
                    {/* <Link className="home-button" to={'/returning'}>Returning</Link> */}
                </div>
                 
                <div className="login-button">
                    {/* <Link className="home-button" to={'/login'}>Login</Link> */}
                </div>
            </div>
        </div>

    )
};

export default Home;
    