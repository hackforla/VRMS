import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


import '../sass/Event.scss';
// import '../sass/Event-media-queries.scss';

const Event = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [event, setEvent] = useState([]);
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
            setIsLoading(true);
            const res = await fetch(`http://localhost:4000/api/events/${props.match.params.id}`);
            const resJson = await res.json();
            
            setEvent(resJson);
            setIsLoading(false);
        } catch(error) {
            // setIsError(error);
            setIsLoading(false);
        }
    }

    async function setCheckInReady(e) {
        e.preventDefault();
        console.log('Hello!');
        const payload = { checkInReady: true };

        try {
        setIsLoading(true);
        await fetch(`http://localhost:4000/api/events/${props.match.params.id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        console.log('Done');
        setIsLoading(false);
        } catch(error) {
            // setIsError(error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchEvent();
        // fetchRsvps();

    }, []);

    return (
            <div className="flexcenter-container">
                {isLoading ? <div>Loading...</div> : (
                    <div className="event">
                        {event && event.location ? (
                            <div className="event-headers">
                                <h4>{event.name}</h4>
                                {/* <h5>RSVP's: {event.rsvps.length}</h5> */}
                                <p>{event.date}</p>
                                <p>{event.location.city}</p>
                                <p>{event.location.state}</p>
                            </div>
                            ) : (
                                <div>Loading...</div>
                            )
                        }

                        <div className="set-checkin-button">    
                            <Link 
                                to={`/events/${event._id}`}
                                onClick={e => setCheckInReady(e)}>
                                    OPEN
                            </Link>
                        </div>
                    </div>
                )}
            </div>
    )
};

export default Event;
    