import React from 'react';
import '../sass/UserProfile.scss';
import UserTable from '../components/presentational/profile/UserTable';
import UserEvents from '../components/presentational/profile/UserEvents';
import UserTeams from '../components/presentational/profile/UserTeams';
import { UserProvider, UserContext } from '../context/userContext';
import { Box, Typography, Grid } from '@mui/material';

const UserProfile = (props) => (
  <UserProvider>
    <Box>
      <Box style={{ backgroundColor: '#bad3ff' }}>
        <Typography
          variant="h3"
          component="h3"
          style={{
            fontSize: '24px',
            fontFamily: 'Source Code Pro, monospace',
            padding: '5px 23.4844px',
            fontWeight: 800,
          }}
        >
          My Profile
        </Typography>
      </Box>
      <UserContext.Consumer>
        {({ user, removeOption }) => (
          <UserTable context={{ user, removeOption }} />
        )}
      </UserContext.Consumer>
      <Box style={{ backgroundColor: '#bad3ff' }}>
        <Typography
          variant="h4"
          component="h4"
          style={{
            fontSize: '18.4px',
            fontFamily: 'Source Code Pro, monospace',
            padding: '5px 23.4844px',
            fontWeight: 800,
          }}
        >
          My Upcoming Events
        </Typography>
      </Box>
      <UserContext.Consumer>
        {({ events }) => <UserEvents context={{ events }} />}
      </UserContext.Consumer>
      <Box style={{ backgroundColor: '#bad3ff' }}>
        <Typography
          variant="h4"
          component="h4"
          style={{
            fontSize: '18.4px',
            fontFamily: 'Source Code Pro, monospace',
            padding: '5px 23.4844px',
            fontWeight: 800,
          }}
        >
          My Teams
        </Typography>
      </Box>
      <UserContext.Consumer>
        {({ teams }) => <UserTeams context={{ teams }} />}
      </UserContext.Consumer>
    </Box>
  </UserProvider>
);

export default UserProfile;
