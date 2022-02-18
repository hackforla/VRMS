import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { REACT_APP_CUSTOM_REQUEST_HEADER } from "../utils/globalSettings";

import '../sass/Event.scss';
// import '../sass/Event-media-queries.scss';

const Event = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [event, setEvent] = useState([]);
    const [isCheckInReady, setIsCheckInReady] = useState();
    const headerToSend = REACT_APP_CUSTOM_REQUEST_HEADER;

    // const [isError, setIsError] = useState(null);
    // const [selected, setSelected] = useState('checkIns');
    // const [rsvps, setRsvps] = useState([]);


    // const rsvpRef = useRef(null);

    // async function fetchRsvps() {
    //     try {
    //         const res = await fetch(`http://localhost:4000/api/rsvps/checkInTrue/${props.match.params.id}`);
    //         const resJson = await res.json();
    //         console.log(resJson);
    //         setRsvps(resJson);
    //     } catch(error) {
    //         setIsError(error);
    //     }
    // }

    // async function setCheckInReady() {
    //     try {
    //         const res = await fetch(`http://localhost:4000/api/rsvps/checkInTrue/${props.match.params.id}`);
    //         const resJson = await res.json();
    //         console.log(resJson);
    //         setRsvps(resJson);
    //     } catch(error) {
    //         setIsError(error);
    //     }
    // }

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
            // setIsError(error);
        }
    }

    async function setCheckInReady(e) {
        e.preventDefault();
        
        try {
            // const payload = { checkInReady: true };

            await fetch(`/api/events/${props.match.params.id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    "x-customrequired-header": headerToSend
                },
                // body: JSON.stringify(payload)
            })
                .then(response => {
                    if (response.ok) {
                        setEvent(event);
                        setIsCheckInReady(!isCheckInReady);
                    }
                });

        } catch(error) {
            // setIsError(error);
            setIsLoading(!isLoading);
        }
    }

    useEffect(() => {
        fetchEvent();
        // fetchRsvps();
    }, [fetchEvent, isLoading, isCheckInReady]);

    return (
        <div className="flex-container">
            <div className="event-container">
                {event && event.location ? (
                    <div className="event-headers">
                        <h4>{event.name}</h4>
                        {/* <h5>RSVP's: {event.rsvps.length}</h5> */}
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
    