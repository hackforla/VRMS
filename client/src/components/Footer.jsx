import React from 'react';
import { Redirect } from 'react-router-dom';

import pkg from '../../package.json';
import useAuth from '../hooks/useAuth';
import { Button, Box, Typography } from '@mui/material';

import '../sass/Footer.scss';

const Footer = () => {
  const { auth, logout } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    return <Redirect to="/" />;
  };

  return (
    //<Box className="footer-wrapper">
    <Box
      component="footer"
      sx={{ display: 'flex', alignItems: 'center', padding: '5px 0' }}
      aria-label="footer"
    >
      <Typography
        variant="body2"
        sx={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase' }}
      >{`v${pkg.version} "Alpha"`}</Typography>

      {auth?.user && (
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            left: '50%',
            transform: 'translateX(-50%)',
            minWidth: 'max-content',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: '9px',
              whiteSpace: 'nowrap',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >{`Hi ${auth.user.name.firstName}`}</Typography>
          <Button
            sx={{
              fontSize: '9px',
              marginLeft: '4px',
            }}
            onClick={handleLogout}
          >{`(LOGOUT)`}</Button>
        </Box>
      )}
    </Box>
  );
};

export default Footer;
