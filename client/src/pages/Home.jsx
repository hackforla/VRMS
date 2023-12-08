import React, { useState, useEffect } from 'react';
import CheckInButtons from '../components/presentational/CheckInButtons';
import CreateNewProfileButton from '../components/presentational/CreateNewProfileButton';
import { REACT_APP_CUSTOM_REQUEST_HEADER as headerToSend } from '../utils/globalSettings';
import { CircularProgress, Box, Typography } from '@mui/material';

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
    <Box className="home">
      <Box className="home-headers">
        <h1>VRMS</h1>
        <h2>Volunteer Relationship Management System</h2>
      </Box>

      {events && events.length > 0 ? (
        <Box className="meeting-select-container">
          <form
            className="form-select-meeting"
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
          >
            <Box className="form-row">
              <Box className="form-input-select">
                <label htmlFor={'meeting-checkin'}>
                  Select a meeting to check-in:
                </label>
                <Box className="radio-buttons">
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
                </Box>
              </Box>
            </Box>
          </form>
        </Box>
      ):(

      <Box className="home-buttons">
        {/* If no events with checkInReady: true */}
        {/* If no meetings available*/}
        <h4>No meetings available</h4>
        <CreateNewProfileButton />
      </Box>
      )}  
        {/* If any events with checkInReady: true */}
        {events.length > 0 && (
          <Box className="home-buttons">
            <CheckInButtons
              disabled={selectedEvent === ''}
              event={selectedEvent}
              events={events}
            />
          </Box>  
        )}
    </Box>
  );
};

export default Home;
