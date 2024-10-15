import React, { useState } from 'react';
import ReadyEvents from '../components/ReadyEvents';
import { Box, Typography } from '@mui/material';

const ReturningUser = (props) => {
  const [returningUser] = useState(true);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
      }}
    >
      <Box>
        <Typography
          variant="h3"
          sx={{
            fontSize: '39.2px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.7px',
            fontFamily:
              '"alisoregular", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        >
          Welcome Back!
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontSize: '28px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '-0.7px',
            fontFamily:
              '"alisoregular", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        >
          We're happy to see you
        </Typography>
        <ReadyEvents returningUser={returningUser} />
      </Box>
    </Box>
  );
};

export default ReturningUser;
