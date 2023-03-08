import React, { useState } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { authLevelRedirect } from '../utils/authUtils';
import HflaImg from '../svg/hflalogo.svg';
import { Box, Button, Grid } from '@mui/material';
import { styled } from '@mui/system';
// import '../sass/Navbar.scss';

const Navbar = (props) => {
  // check user accessLevel and adjust link accordingly
  const { auth } = useAuth();
  let loginRedirect = '/admin';
  if (auth?.user) {
    loginRedirect = authLevelRedirect(auth.user);
  }

  const [selected, setSelected] = useState(1);

  // Styles that may need to be included in the theme.
  const StyledButton = styled(Button)({
    color: 'black',
    marginLeft: '2rem',
    padding: '0.1rem 0.5rem',
    borderRadius: 0,
    fontSize: '1rem',
  });

  // Displays a line below the page link the user is on.
  const active = {
      '&.active': {
        borderBottom: '2px #fa114f solid',
      },
  };

  return (
    <>
      {<Box mt={2} mb={2} sx={{ width: '100%', typography: 'body 1' }}>
          <Grid container spacing={12}>
            <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
              {/* No auth page -> Displays 'Checkin' and 'Admin'. */}
              {!auth?.user && (
                <>
                  <StyledButton
                    component={NavLink}
                    to="/"
                    sx={selected === 1 && active}
                    onClick={() => setSelected(1)}
                  >
                    CHECK IN
                  </StyledButton>
                  <StyledButton
                    component={NavLink}
                    to="/login"
                    sx={selected === 2 && active}
                    onClick={() => setSelected(2)}
                  >
                    ADMIN
                  </StyledButton>
                </>
              )}
              {/* Admin auth -> Displays 'Users' and 'Projects'. */}
              {auth?.user?.accessLevel === 'admin' && (
                <>
                  <StyledButton
                      component={NavLink}
                      to="/useradmin"
                      sx={selected === 1 && active}
                      onClick={() => setSelected(1)}
                    >
                      USERS
                    </StyledButton>
                  <StyledButton
                      component={NavLink}
                      to={"/projects"}
                      sx={selected === 2 && active}
                      onClick={() => setSelected(2)}
                    >
                      PROJECTS
                    </StyledButton>
                </>
              )}
              {/* User auth -> Displays 'Projects' only. */}
              {auth?.user?.accessLevel === 'user' && (
                <>
                  <StyledButton
                    component={NavLink}
                    to={'/projects'}
                    sx={selected === 2 && active.button}
                    onClick={() => setSelected(2)}
                  >
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