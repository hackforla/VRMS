import { Box, Link, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useFeatureFlags } from '../context/featureFlagsContext';
import useAuth from '../hooks/useAuth';

export default function UserWelcome() {
  const { auth } = useAuth();
  const { flags } = useFeatureFlags();

  const user = auth?.user;

  const firstName = user?.name.firstName;

  console.log(user, 'user');
  return (
    <Box textAlign="center" sx={{ pt: 5 }}>
      <Typography variant="h1">
        Welcome {flags.cool_welcome_message && 'Sir'} {firstName}!
      </Typography>
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
    </Box>
  );
}
