import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { ReactComponent as ClockIcon} from '../svg/Icon_Clock.svg';
import { ReactComponent as LocationIcon} from '../svg/Icon_Location.svg';
import { ReactComponent as PlusIcon } from '../svg/Icon_Plus.svg';
import { REACT_APP_CUSTOM_REQUEST_HEADER } from "../utils/globalSettings";

import '../sass/Events.scss';

const Events = (props) => {
    const [events, setEvents] = useState([]);
    const headerToSend = REACT_APP_CUSTOM_REQUEST_HEADER;

    async function fetchData() {
        try {
            const res = await fetch("/api/events", {
                headers: {
                    "x-customrequired-header": headerToSend
                }
            });
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
    <div className="events-list">
        <ul>
        {events.map((event, index) => {
            const event_city =
            event.location && (event.location.city || 'TBD');
            const event_state =
            event.location && (event.location.state || 'TBD');

            return (
            <li key={index}>
                <div key={index} className="list-event-container">
                <div className="list-event-headers">
                    <p className="event-name">{event.name}</p>

                    <div className="event-info">
                    <div className="event-info-container">
                        <div className="event-info-wrapper">
                        <ClockIcon />
                        <p className="event-info-text">
                            {moment(event.date).format('ddd, MMM D @ h:mm a')}
                        </p>
                        </div>
                        <div className="event-info-wrapper">
                        <LocationIcon />
                        <p className="event-info-text">
                            {event_city}, {event_state}
                        </p>
                        </div>
                    </div>
                    <div className="event-details-container">
                        <Link to={`/event/${event._id}`}>Details</Link>
                    </div>
                    </div>
                </div>
                </div>
            </li>
            );
        })}
        </ul>
        <div className="add-event-btn">
        <Link to="/projects" className="add-event-link">
            <PlusIcon />
            <span className="add-event-link-text">ADD EVENT</span>
        </Link>
        </div>
    </div>

    );
};

export default Events;
    