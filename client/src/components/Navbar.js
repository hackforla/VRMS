import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import HflaImg from '../svg/hflalogo.svg';
import { Box, Button, Grid } from '@mui/material';
import { styled } from '@mui/system';
import theme from '../theme';

const Navbar = (props) => {
  // check user accessLevel and adjust link accordingly
  const { auth } = useAuth();
 
  const StyledButton = styled(Button)({
    color: '#757575',
    marginLeft: '2rem',
    marginRight: '1.5rem',
    padding: '0rem 0rem',
    borderRadius: 0,
    fontSize: '1rem',
    fontFamily: 'Source Code Pro',
    '&.active': {
      color: '#000000',
      borderBottom: `2px ${theme.palette.primary.main} solid`,
      fontWeight: '800',
    },
    '&:hover': {
      backgroundColor: 'transparent',
    },
  });

  return (
        <Box mt={4} mb={2} sx={{ width: '100%', typography: 'body 1' }}>
          <Grid container spacing={4}>
            <Grid mx={2} item sx={{ display: 'flex', justifyContent: 'center' }}>
              {/* No auth page -> Displays 2 links -> 'Checkin' and 'Admin'. */}
              {!auth?.user && (
                <>
                  <StyledButton component={NavLink} exact to="/">
                    CHECK IN
                  </StyledButton>
                  <StyledButton component={NavLink} to="/login">
                    ADMIN
                  </StyledButton>
                </>
              )}
              {/* Admin auth -> Displays 2 links -> 'Users' and 'Projects'. */}
              {auth?.user?.accessLevel === 'admin' && (
                <>
                  <StyledButton component={NavLink} to="/useradmin">
                    USERS
                  </StyledButton>
                  <StyledButton component={NavLink} to="/projects">
                    PROJECTS
                  </StyledButton>
                </>
              )}
              {/* User auth -> Displays 1 link -> 'Projects' only. */}
              {auth?.user?.accessLevel === 'user' && (
                <>
                  <StyledButton component={NavLink} to="/projects">
                    PROJECTS
                  </StyledButton>
                </>
              )}
            </Grid>
            <Grid item>
              <Box component="img" src={HflaImg} sx={{ width: '100%' }} />
            </Grid>
          </Grid>
        </Box>
  );
};

export default withRouter(Navbar);