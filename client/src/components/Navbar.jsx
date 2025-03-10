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
    padding: '6px 0',
    borderRadius: 0,
    fontSize: '20px',
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
    <Box sx={{ my: 2, mx: { xs: 0, sm: 4 } }}>
      <Grid container>
        <Grid item>
          <NavLink to={!auth?.user ? '/' : '/welcome'}>
            <Box
              component="img"
              src={HflaImg}
              sx={{ width: '48.3px', mt: '7px' }}
            />
          </NavLink>
        </Grid>
        <Grid
          item
          xs={10}
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
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
              <StyledButton component={NavLink} to="/users">
                USERS
              </StyledButton>
              <StyledButton component={NavLink} to="/projects">
                PROJECTS
              </StyledButton>
              <StyledButton component={NavLink} to="/admin">
                STATS
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
      </Grid>
    </Box>
  );
};

export default withRouter(Navbar);
