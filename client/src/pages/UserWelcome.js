import React from 'react';
import { Typography, Box, Button, Link } from '@mui/material';
import useAuth from '../hooks/useAuth';

export default function UserWelcome() {
  const { auth } = useAuth();

  const user = auth?.user;

  const firstName = user?.name.firstName;

  console.log('AUTH', auth);
  return (
    <Box textAlign="center" sx={{ pt: 5 }}>
      <Typography variant="h1">Greetings {firstName}!</Typography>
      <Typography variant="p">
        Welcome to the Volunteer Relationship Managment System. For assistance,
        please see the{' '}
      </Typography>
      <Link
        target="_blank"
        href="https://github.com/hackforla/VRMS/wiki/User-Guide"
        color="secondary"
        sx={{ fontFamily: 'aliseoregular' }}
      >
        User Guide Wiki
      </Link>
    </Box>
  );
}
