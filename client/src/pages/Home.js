import React, { useState, useEffect } from 'react';
import CheckInButtons from '../components/presentational/CheckInButtons';
import CreateNewProfileButton from '../components/presentational/CreateNewProfileButton';
import { REACT_APP_CUSTOM_REQUEST_HEADER as headerToSend } from '../utils/globalSettings';

import '../sass/Home.scss';

const Home = (props) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState('--SELECT ONE--');

  const handleEventChange = (e) => {
    setEvent(e.currentTarget.value);
  };

  useEffect(() => {
    async function fetchLiveEvents() {
      try {
        const res = await fetch('/api/events?checkInReady=true', {
          headers: {
            'x-customrequired-header': headerToSend,
          },
        });
        console.log('RESPONSE', await res.json());
        const resJson = await res.json();
        await resJson.unshift('--SELECT ONE--');

        setEvents(resJson);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }

    fetchLiveEvents();
  }, []);

  console.log('events', events);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home">
      <div className="home-headers">
        <h1>VRMS</h1>
        <h2>Volunteer Relationship Management System</h2>
      </div>

      {events && events.length > 1 && (
        <div className="meeting-select-container">
          <form
            className="form-select-meeting"
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="form-row">
              <div className="form-input-select">
                <label htmlFor={'meeting-checkin'}>
                  Select a meeting to check-in:
                </label>
                <div className="radio-buttons">
                  <select
                    name={'meeting-checkin'}
                    className="select-meeting-dropdown"
                    onChange={handleEventChange}
                    required
                  >
                    {events.map((event) => {
                      return (
                        <option key={event._id || 0} value={event._id}>
                          {event.name || '--SELECT ONE--'}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {events.length > 0 && (
        <div className="home-buttons">
          {event === '--SELECT ONE--' && events.length === 1 && (
            <CreateNewProfileButton />
          )}
          {events.length > 1 && (
            <CheckInButtons
              disabled={event === '--SELECT ONE--'}
              event={event}
              events={events}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
