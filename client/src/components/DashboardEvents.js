import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// import '../sass/EventsContainer.scss';
// import '../sass/EventsContainer-media-queries.scss';

const DashboardEvents = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [isError, setIsError] = useState(false);

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
                        return (
                            <li key={index}>
                                <div key={index} className="event">
                                    <h4>{event.name}</h4>
                                    <Link to={`/event/${event._id}`}>Details</Link>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
};

export default DashboardEvents;
    