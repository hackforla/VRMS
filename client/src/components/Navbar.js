import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import HflaImg from '../svg/hflalogo.svg';
import { Box, Button, Grid } from '@mui/material';
import { styled } from '@mui/system';

const Navbar = (props) => {
  // check user accessLevel and adjust link accordingly
  const { auth } = useAuth();

  // Styles that may need to be included in the theme.
  const StyledButton = styled(Button)({
    color: 'black',
    marginLeft: '2rem',
    padding: '0.01rem 0rem',
    borderRadius: 0,
    fontSize: '1rem',
    fontFamily: 'Source Code Pro',
    fontWeight: '600',
    '&.active': {
      borderBottom: '2px #fa114f solid',
      fontWeight: '800',
    },
  });

  return (
    <>
      {
        <Box mt={2} mb={2} sx={{ width: '100%', typography: 'body 1' }}>
          <Grid container spacing={12}>
            <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
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
      }
    </>
  );
};

export default withRouter(Navbar);