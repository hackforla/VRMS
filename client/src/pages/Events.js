import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import { REACT_APP_CUSTOM_REQUEST_HEADER } from '../utils/globalSettings';

import '../sass/Events.scss';
import useAuth from '../hooks/useAuth';

const Events = (props) => {
  const { auth } = useAuth();
  const [events, setEvents] = useState([]);
  const [eventSearchParam, setEventSearchParam] = useState('');
  const headerToSend = REACT_APP_CUSTOM_REQUEST_HEADER;

  async function fetchData() {
    try {
      const res = await fetch('/api/events', {
        headers: {
          'x-customrequired-header': headerToSend,
        },
      });
      const resJson = await res.json();

      setEvents(resJson);
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return auth && auth.user ? (
    <div className="events-list">
      <p>Filter:</p>
      <input
        style={{ marginBottom: '10px' }}
        value={eventSearchParam}
        onChange={(e) => setEventSearchParam(e.target.value)}
      />
      <ul>
        {events
          .filter((event) => {
            return (
              typeof event.name === 'string' &&
              event.name.toLowerCase().match(eventSearchParam.toLowerCase())
            );
          })
          .map((event, index) => {
            const event_city = event.location && (event.location.city || 'TBD');
            const event_state =
              event.location && (event.location.state || 'TBD');

            return (
              <li key={index}>
                <div key={index} className="list-event-container">
                  <div className="list-event-headers">
                    <Link to={`/event/${event._id}`}>
                      <p className="event-name">
                        {' '}
                        {event.name}
                        ({moment(event.date).format('ddd, MMM D @ h:mm a')})
                      </p>
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  ) : (
    <Redirect to="/login" />
  );
};

export default Events;