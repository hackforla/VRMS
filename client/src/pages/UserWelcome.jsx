import React from 'react';
import { Typography, Box, Link } from '@mui/material';
import useAuth from '../hooks/useAuth';

export default function UserWelcome() {
  const { auth } = useAuth();

  const user = auth?.user;

  const firstName = user?.name.firstName;

  console.log('AUTH', auth);
  return (
    <Box textAlign="center" sx={{ pt: 5 }}>
      <Typography variant="h1">Welcome {firstName}!</Typography>
      <Box sx={{ fontSize: '16px' }}>
        <Typography variant="p">
          For assistance using VRMS, check out the{' '}
        </Typography>
        <Link
          target="_blank"
          href="https://github.com/hackforla/VRMS/wiki/User-Guide"
          color="secondary"
          sx={{ fontFamily: 'aliseoregular' }}
        >
          User Guide
        </Link>
      </Box>
    </Box>
  );
}
