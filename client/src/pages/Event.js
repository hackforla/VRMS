import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { REACT_APP_CUSTOM_REQUEST_HEADER } from "../utils/globalSettings";

import '../sass/Event.scss';

const Event = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [event, setEvent] = useState([]);
    const [isCheckInReady, setIsCheckInReady] = useState();
    const headerToSend = REACT_APP_CUSTOM_REQUEST_HEADER;
    
    async function fetchEvent() {
        try {
            const res = await fetch(`/api/events/${props.match.params.id}`, {
                    headers: {
                        "x-customrequired-header": headerToSend
                    }
                });
            const resJson = await res.json();
            
            setEvent(resJson);
            setIsCheckInReady(resJson.checkInReady);

        } catch(error) {
            console.log(error);
        }
    }

    async function setCheckInReady(e) {
        e.preventDefault();
        
        try {
            await fetch(`/api/events/${props.match.params.id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    "x-customrequired-header": headerToSend
                },
            })
                .then(response => {
                    if (response.ok) {
                        setEvent(event);
                        setIsCheckInReady(!isCheckInReady);
                    }
                });

        } catch(error) {
            setIsLoading(!isLoading);
        }
    }

    useEffect(() => {
        fetchEvent();
    }, [isLoading, isCheckInReady]);

    return (
        <div className="flex-container">
            <div className="event-container">
                {event && event.location ? (
                    <div className="event-headers">
                        <h4>{event.name}</h4>
                        <p>{moment(event.date).format('dddd, MMMM D, YYYY @ h:mm a')}</p>
                        <p>{event.location.city}</p>
                        <p>{event.location.state}</p>
                    </div>
                    ) : (
                        <div>Loading...</div>
                    )
                }

                <div className="set-checkin-button">    
                    {event && isCheckInReady === false ? 
                        (
                            <Link 
                                to={`/events/${event._id}`}
                                onClick={e => setCheckInReady(e)}>
                                    OPEN
                            </Link>
                        ) : (
                            <Link 
                                to={`/events/${event._id}`}
                                onClick={e => setCheckInReady(e)}>
                                    CLOSE
                            </Link>
                        )
                    }
                </div>
            </div>
        </div>
    )
};

export default Event;
    