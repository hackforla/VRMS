import React, { useState, useEffect } from 'react';
import CheckInButtons from '../components/presentational/CheckInButtons';
import CreateNewProfileButton from '../components/presentational/CreateNewProfileButton';
import { REACT_APP_CUSTOM_REQUEST_HEADER as headerToSend } from '../utils/globalSettings';
import { CircularProgress, Box, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import '../sass/Home.scss';
import aliseowoff2 from '../fonts/aliseo-noncommercial-webfont.woff2';

const fontTheme = createTheme({
  typography: {
    fontFamily: ['aliseoregular',
     '-apple-system',
      'BlinkMacSystemFont', 
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      '"Fira Sans"',
      '"Droid Sans"',
      '"Helvetica Neue"',
      'sans-serif',].join(','),
    h1: {
      fontSize: '7rem',
      lineHeight: '0.85rem',
      letterSpacing: '0.05rem',
      '@media (min-width:500px)': {
        fontSize: '6rem',
        lineHeight: '0.75rem',
      },
    },
    h2: {
      fontSize: '2.8rem',
      lineHeight: '1.05rem',
      letterSpacing: '0.025rem',
      '@media (min-width:500px)': {
        fontSize: '2.7rem',
        lineHeight: '1rem',
      },
    },
    h4: {
      fontSize: '2rem',
      '@media (min-width:500px)': {
        fontSize: '2rem',
      },
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'aliseoregular';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('aliseoregular'), local('aliseoregular'), url(${aliseowoff2}) format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
    },
  },
});

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
    <ThemeProvider theme={fontTheme}>
      <Box className="home">
        <Box className="home-headers">
          <Typography variant='h1'>VRMS</Typography>
          <Typography variant='h2'>Volunteer Relationship Management System</Typography>
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
          <Typography variant='h4'>No meetings available</Typography>
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
    </ThemeProvider>
  );
};

export default Home;
