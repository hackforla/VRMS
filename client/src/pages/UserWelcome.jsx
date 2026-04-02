import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { REACT_APP_CUSTOM_REQUEST_HEADER as headerToSend } from '../utils/globalSettings';

const h1sx = {
  fontFamily: 'aliseoregular',
  fontWeight: 'bold',
  fontSize: { xs: '5.3rem' },
  marginBottom: `0rem`,
};

const h4sx = {
  ...h1sx,
  fontSize: { xs: '1.8rem' },
};

export default function UserWelcome() {
  const { auth } = useAuth();

  const user = auth?.user;

  const firstName = user?.name.firstName;

  const [events, setEvents] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState('');

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
  console.log('EVENTS', events);
  // render loading spinner until API response
  if (!events) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 15 }}>
        <CircularProgress />
      </Box>
    );
  }

  console.log('AUTH', auth);
  return (
    <Box textAlign="center" sx={{ pt: 5 }}>
      <Typography variant="h1">Welcome {firstName}!</Typography>
      <Box sx={{ fontSize: '16px' }}>
        <Typography variant="p">For assistance using VRMS, check out the </Typography>
        <Link
          target="_blank"
          href="https://github.com/hackforla/VRMS/wiki/User-Guide"
          color="secondary"
          sx={{ fontFamily: 'aliseoregular' }}
        >
          User Guide
        </Link>
      </Box>
      {events && events.length === 0 ? (
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
        <Box>
          {/* If no events with checkInReady: true */}
          {/* If no meetings available*/}
          <Typography variant="h4" sx={h4sx}>
            No meetings available
          </Typography>
        </Box>
      )}
      {/* If any events with checkInReady: true */}
      {events.length > 0 && (
        <Box>
          <CheckInButtons disabled={selectedEvent === ''} event={selectedEvent} events={events} />
        </Box>
      )}
    </Box>
  );
}
