import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import CheckInButtons from '../components/presentational/CheckInButtons';
import CreateNewProfileButton from '../components/presentational/CreateNewProfileButton';
import { useFeatureFlags } from '../context/featureFlagsContext';
import { REACT_APP_CUSTOM_REQUEST_HEADER as headerToSend } from '../utils/globalSettings';

import '../sass/Home.scss';

const h1sx = {
  fontFamily: 'aliseoregular',
  fontWeight: 'bold',
  fontSize: { xs: '5.3rem' },
  marginBottom: `0rem`,
};

const h2sx = {
  ...h1sx,
  fontSize: { xs: '2.8rem' },
  marginTop: '-0.9rem',
  lineHeight: '2.7rem',
};

const h4sx = {
  ...h1sx,
  fontSize: { xs: '1.8rem' },
};

const Home = () => {
  const [events, setEvents] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState('');
  const { flags } = useFeatureFlags();

  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
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

  console.log(flags, 'flags', 'user not logged in');

  return (
    <Box className="home">
      {flags.is_friendly && <div>G'day mate</div>}
      <Box className="home-headers">
        <Typography variant="h1" sx={h1sx}>
          VRMS
        </Typography>
        <Typography variant="h2" sx={h2sx}>
          Volunteer Relationship Management System
        </Typography>
      </Box>

      {events && events.length > 0 ? (
        <Box className="meeting-select-container">
          <FormControl
            className="form-select-meeting"
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
            variant="standard"
          >
            <Box className="form-row">
              <Box className="form-input-select">
                <InputLabel id="select-meeting-label">Select a meeting to check-in:</InputLabel>
                <Box className="radio-buttons">
                  <Select
                    labelId="select-meeting-label"
                    className="select-meeting-dropdown"
                    value={selectedEvent ? selectedEvent : '--SELECT ONE--'}
                    renderValue={(selected) => (
                      <Typography sx={{ color: 'red' }}>
                        {selectedEvent ? selectedEvent : '--SELECT ONE--'}
                      </Typography>
                    )}
                    onChange={handleEventChange}
                  >
                    {events.map((event) => {
                      return (
                        <MenuItem
                          key={event._id || 0}
                          value={event.project?.name + ' - ' + event.name}
                        >
                          <Typography>{event?.project?.name + ' - ' + event.name}</Typography>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Box>
              </Box>
            </Box>
          </FormControl>
        </Box>
      ) : (
        <Box className="home-buttons">
          {/* If no events with checkInReady: true */}
          {/* If no meetings available*/}
          <Typography variant="h4" sx={h4sx}>
            No meetings available
          </Typography>
          <CreateNewProfileButton />
        </Box>
      )}
      {/* If any events with checkInReady: true */}
      {events.length > 0 && (
        <Box className="home-buttons">
          <CheckInButtons disabled={selectedEvent === ''} event={selectedEvent} events={events} />
        </Box>
      )}
    </Box>
  );
};

export default Home;
