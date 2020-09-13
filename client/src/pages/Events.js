import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { ReactComponent as ClockIcon} from '../svg/Icon_Clock.svg';
import { ReactComponent as LocationIcon} from '../svg/Icon_Location.svg';

import '../sass/Events.scss';

const Events = (props) => {
  // const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  // const [isError, setIsError] = useState(false);

  async function fetchData() {
    try {
      const res = await fetch('/api/events');
      const resJson = await res.json();

      setEvents(resJson);
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    // auth && auth.user ? (
    <div className="flexcenter-container">
      <div className="events-list">
        <ul>
          {events.map((event, index) => {
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
                            {event.location.city}, {event.location.state}
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
      </div>
    </div>
    // ) : (
    //     <Redirect to="/login" />
    // )
  );
};

export default Events;
    