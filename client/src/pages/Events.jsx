import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import { REACT_APP_CUSTOM_REQUEST_HEADER as headerToSend } from '../utils/globalSettings';
import {
  Box,
  List,
  TextField,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

import '../sass/Events.scss';
import useAuth from '../hooks/useAuth';

const Events = (props) => {
  const { auth } = useAuth();
  const [events, setEvents] = useState(null);
  const [eventSearchParam, setEventSearchParam] = useState('');

  useEffect(() => {
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
        setEvents([]);
      }
    }
    fetchData();
  }, []);

  const filteredEvents = events?.filter(
    (event) =>
      typeof event.name === 'string' &&
      event.name.toLowerCase().match(eventSearchParam.toLowerCase())
  );

  return auth && auth.user ? (
    <Box className="events-list">
      <TextField
        label="Filter:"
        variant="outlined"
        sx={{ my: 2 }}
        value={eventSearchParam}
        onChange={(e) => setEventSearchParam(e.target.value)}
        placeholder="Search events..."
      />
      {events === null ? (
        <Typography>Loading data...</Typography>
      ) : filteredEvents.length === 0 ? (
        <Typography>No events found.</Typography>
      ) : (
        <List >
          {filteredEvents.map((event, index) => (
            <ListItem key={index}  className="event-name">
              <Link to={`/event/${event._id}`}>
                <ListItemText>
                  {event.name} (
                  {moment(event.date).format('ddd, MMM D @ h:mm a')})
                </ListItemText>
              </Link>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  ) : (
    <Redirect to="/login" />
  );
};

export default Events;
