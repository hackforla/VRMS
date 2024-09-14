import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import ReadyEvents from '../components/ReadyEvents';

const NewUser = (props) => {
  const [newUser] = useState(true);

  useEffect(() => {}, []);

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
        }}
      >
        <Box
          sx={{
            maxWidth: '400px',
            marginBottom: '4vh',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              textTransform: 'uppercase',
              fontSize: '39.2px',
              letterSpacing: '-1px',
              lineHeight: '1',
            }}
          >
            Welcome!
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              fontSize: '28px',
              letterSpacing: '-1px',
              lineHeight: '1',
            }}
          >
            Thanks for coming.
          </Typography>
          <ReadyEvents newUser={newUser} />
        </Box>
      </Box>
    </Container>
  );
};

export default NewUser;
