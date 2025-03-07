import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import { REACT_APP_CUSTOM_REQUEST_HEADER as headerToSend } from '../utils/globalSettings';
import { Box, List } from '@mui/material';

import '../sass/Events.scss';
import useAuth from '../hooks/useAuth';

const Events = (props) => {
  const { auth } = useAuth();
  const [events, setEvents] = useState([]);
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
      }
    }

    fetchData();
  }, []);

  return auth && auth.user ? (
    <Box className="events-list">
      <TextField
        variant="outlined"
        sx={{ mb: 2 }}
        value={eventSearchParam}
        onChange={(e) => setEventSearchParam(e.target.value)}
        placeholder="Search events..."
      />

      <List>
        {events
          .filter((event) => {
            return (
              typeof event.name === 'string' &&
              event.name.toLowerCase().match(eventSearchParam.toLowerCase())
            );
          })
          .map((event, index) => {
            return (
              <ListItem key={index}>
                <Box className="list-event-container">
                  <Box className="list-event-headers">
                    <Link to={`/event/${event._id}`}>
                      <ListItemText className="event-name">
                        {' '}
                        {event.name}(
                        {moment(event.date).format('ddd, MMM D @ h:mm a')})
                      </ListItemText>
                    </Link>
                  </Box>
                </Box>
              </ListItem>
            );
          })}
      </List>
    </Box>
  ) : (
    <Redirect to="/login" />
  );
};

export default Events;
