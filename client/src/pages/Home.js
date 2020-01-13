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
                <div class="rotated-home"></div>
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

{/* <a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@thisisflik?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Steven Pahel"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Steven Pahel</span></a> */}


export default Home;
    