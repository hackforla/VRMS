import React, { useState, useEffect } from 'react';
import CheckInButtons from '../components/presentational/CheckInButtons';
import CreateNewProfileButton from '../components/presentational/CreateNewProfileButton';
import { REACT_APP_CUSTOM_REQUEST_HEADER as headerToSend } from '../utils/globalSettings';
import { CircularProgress, Box } from '@mui/material';

import '../sass/Home.scss';

const Home = () => {
  const [events, setEvents] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState('');

  const handleEventChange = (e) => {
    setSelectedEvent(e.currentTarget.value);
  };

  // Fetching only events with checkInReady = true
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events?checkInReady=true', {
          headers: {
            'x-customrequired-header': headerToSend,
          },
        });
        const resJson = await res.json();

        setEvents(resJson);
      } catch (error) {
        console.log(error);
      }
    }
    fetchEvents();
  }, []);

  // render loading spinner until API response
  if (!events) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 15 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="home">
      <div className="home-headers">
        <h1>VRMS</h1>
        <h2>Volunteer Relationship Management System</h2>
      </div>

      {events && events.length >= 1 && (
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
                    defaultValue="--SELECT ONE--"
                  >
                    <option value="--SELECT ONE--" disabled hidden>
                      --SELECT ONE--
                    </option>
                    {events.map((event) => {
                      return (
                        <option key={event._id || 0} value={event._id}>
                          {event?.project?.name + ' - ' + event.name}
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

      <div className="home-buttons">
        {/* If no events with checkInReady: true */}
        {events.length === 0 && <CreateNewProfileButton />}

        {/* If any events with checkInReady: true */}
        {events.length > 0 && (
          <CheckInButtons
            disabled={selectedEvent === ''}
            event={selectedEvent}
            events={events}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
