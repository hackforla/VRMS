import {
  Box,
  Button,
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

const h4sx = {
  fontSize: { xs: '1.8rem' },
  marginTop: '2rem',
  marginBottom: `0rem`,
  fontFamily: 'aliseoregular',
  fontWeight: 'bold',
};

const pstyle = {
  fontSize: '20px',
  fontFamily: 'Source Sans Pro',
  fontWeight: 600,
};

const checkInButton = {
  width: '315px',
  height: '42px',
  borderRadius: '6px',
  fontSize: '20px',
  lineHeight: 'normal',
};

const getEventLabel = (event) => event.project?.name + ' - ' + event.name;

export default function UserWelcome() {
  const { auth } = useAuth();

  const user = auth?.user;

  const firstName = user?.name.firstName;

  const [events, setEvents] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInError, setCheckInError] = useState(null);

  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setCheckInError(null);
    try {
      const eventId = events.find((event) => getEventLabel(event) === selectedEvent)?._id || null;
      const userId = user._id;
      if (!eventId) {
        throw new Error('Event ID is not selected.');
      }
      if (!userId) {
        throw new Error('Logged-in user is not found.');
      }

      const checkInRes = await fetch('/api/checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-customrequired-header': headerToSend,
        },
        body: JSON.stringify({
          userId,
          eventId,
        }),
      });

      if (!checkInRes.ok) {
        throw new Error(checkInRes.statusText);
      }
      setIsCheckedIn(true);
    } catch (error) {
      setCheckInError(error.message);
    }
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

      {events.length > 0 ? (
        <>
          <Box className="meeting-select-container" sx={{ mt: 10 }}>
            {isCheckedIn ? (
              <Box>
                <Typography variant="h1">Success!</Typography>
                <Typography sx={pstyle}>You have checked in to: </Typography>
                <Typography sx={pstyle}>{selectedEvent}</Typography>
              </Box>
            ) : (
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
                            {selected ? selected : '--SELECT ONE--'}
                          </Typography>
                        )}
                        onChange={handleEventChange}
                      >
                        {events.map((event) => {
                          return (
                            <MenuItem key={event._id || 0} value={getEventLabel(event)}>
                              <Typography>{getEventLabel(event)}</Typography>
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </Box>
                  </Box>
                </Box>
              </FormControl>
            )}
          </Box>
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', width: '100%' }}>
            {!isCheckedIn && (
              <Button
                type="submit"
                onClick={handleCheckIn}
                sx={checkInButton}
                disabled={!selectedEvent}
                variant="outlined"
              >
                CHECK IN
              </Button>
            )}
            {checkInError && (
              <Typography color="error" sx={{ mt: 1 }}>
                {checkInError}
              </Typography>
            )}
          </Box>
        </>
      ) : (
        <Box>
          {/* If no meetings available*/}
          <Typography variant="h4" sx={h4sx}>
            No meetings available
          </Typography>
        </Box>
      )}
    </Box>
  );
}
