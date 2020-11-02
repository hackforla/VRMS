import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { ReactComponent as ClockIcon} from '../svg/Icon_Clock.svg';
import { ReactComponent as LocationIcon} from '../svg/Icon_Location.svg';

import '../sass/Events.scss';

const Events = (props) => {
    const [events, setEvents] = useState([]);

    async function fetchData() {
        try {
            const res = await fetch("/api/events");
            const resJson = await res.json();

            setEvents(resJson);
        } catch(error) {
            alert(error);
        }
    }

    useEffect(() => {
        fetchData();

    }, []);

    return (
            <div className="flexcenter-container">
                <div className="events-list">
                    <ul>
                        {events.map((event, index) => {
                            const event_city = event.location && event.location.city || 'TBD'
                            const event_state = event.location && event.location.state || 'TBD'
                            
                            return (
                                <li key={index}>
                                    <div key={index} className="list-event-container">
                                        <div className="list-event-headers">
                                            <p className="event-name">{event.name}</p>

                                            <div className="event-info">
                                                <div className="event-info-container">
                                                    <div className="event-info-wrapper">
                                                        <ClockIcon />
                                                        <p className="event-info-text">{moment(event.date).format('ddd, MMM D @ h:mm a')}</p>
                                                    </div>
                                                    <div className="event-info-wrapper">
                                                        <LocationIcon />                                
                                                        <p className="event-info-text">{event_city}, {event_state}</p>
                                                        
                                                    </div>
                                                </div>
                                                <div className="event-details-container">
                                                    <Link to={`/event/${event._id}`}>Details</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
    )
};

export default Events;
    