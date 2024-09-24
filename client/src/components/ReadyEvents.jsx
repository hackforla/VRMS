import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { REACT_APP_CUSTOM_REQUEST_HEADER as headerToSend} from "../utils/globalSettings";

import '../sass/ReadyEvents.scss';

const ReadyEvents = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function fetchEvent() {
            try {
                setIsLoading(true);
                const res = await fetch("/api/events?checkInReady=true", {
                    headers: {
                        "x-customrequired-header": headerToSend
                    }
                });
                const resJson = await res.json();
    
                setEvents(resJson);
                setIsLoading(false);
            } catch(error) {
                console.log(error);
                setIsLoading(false);
            }
        }

        fetchEvent();
    }, []);

    return (
        <div className="flex-container">
            <h3>Events to check-in for below:</h3>
            {isLoading ? <div>Loading...</div> : (
                <div className="event-container">
                    {events.length > 0 ? (events.map((event, index) => (
                        <div key={index} className="event">
                            <div className="event-headers">
                                <h4>{event.name}</h4>
                                <p>{event.date}</p>
                                <p>{event.location.city}</p>
                                <p>{event.location.state}</p>
                            </div>

                            {props.newUser &&
                                <Link to={`/checkIn/newUser?eventId=${event._id}`} className="checkin-newuser-button">New User Check-In</Link>
                            }

                            {props.returningUser &&
                                <Link  to={`/checkIn/returningUser?eventId=${event._id}`} className="checkin-newuser-button">Returning User Check-In</Link>
                            }
                        </div>
                    ))) : (
                        <div>Check back later...</div>
                    )}
                </div>
            )}
        </div>
    )
};

export default ReadyEvents;
    