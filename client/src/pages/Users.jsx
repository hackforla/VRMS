import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Box, Container } from '@mui/material';

import '../sass/Users.scss';

const Users = () => {
  return (
    <Container className="container--users">
      <Box className="margin-bottom center">
        <Button
          component={Link}
          to="/users/user-search"
          className="button"
          variant="contained"
        >
          User Search
        </Button>
      </Box>
      <Box className="center">
        <Button
          component={Link}
          to="/users/permission-search"
          className="button"
          variant="contained"
        >
          User Permission Search
        </Button>
      </Box>
    </Container>
  );
};

export default Users;
