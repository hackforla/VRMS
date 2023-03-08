import React, { useState } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { authLevelRedirect } from '../utils/authUtils';
import HflaImg from '../svg/hflalogo.svg';
import { Box, Button, Grid } from '@mui/material';

import { styled } from '@mui/system';
import { select } from 'd3';
// import '../sass/Navbar.scss';

const Navbar = (props) => {
  // check user accessLevel and adjust link accordingly
  // const [page, setPage] = useState('home')
  const { auth } = useAuth();
  let loginRedirect = '/admin';
  if (auth?.user) {
    loginRedirect = authLevelRedirect(auth.user);
  }

  const [selected, setSelected] = useState(1);

  const StyledButton = styled(Button)({
    color: 'black',
    marginLeft: '2rem',
    padding: '0.1rem 0.5rem',
    borderRadius: 0,
    fontSize: '1rem',
  });

  const active = {
    button: {
      '&.active': {
        borderBottom: '2px #fa114f solid',
      },
    },
  };

  return (
    <>
      {
        <Box mt={2} mb={2} sx={{ width: '100%', typography: 'body 1' }}>
          <Grid container spacing={12}>
            <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
              {!auth?.user && (
                <>
                  <StyledButton
                    component={NavLink}
                    to="/"
                    sx={selected === 1 && active.button}
                    onClick={() => setSelected(1)}
                  >
                    CHECK IN
                  </StyledButton>
                  <StyledButton
                    component={NavLink}
                    to="/login"
                    sx={selected === 2 && active.button}
                    onClick={() => setSelected(2)}
                  >
                    ADMIN
                  </StyledButton>
                </>
              )}
              {auth?.user?.accessLevel === 'admin' && (
                <>
                  {selected === 1 ? (
                    <StyledButton
                      component={NavLink}
                      to="/useradmin"
                      sx={active.button}
                    >
                      ADMIN
                    </StyledButton>
                  ) : (
                    <StyledButton
                      component={NavLink}
                      to="/useradmin"
                      onClick={() => setSelected(1)}
                    >
                      ADMIN
                    </StyledButton>
                  )}
                  {/* Seperate the buttons */}
                  {selected === 2 ? (
                    <StyledButton
                      component={NavLink}
                      to={'/projects'}
                      sx={active.button}
                    >
                      PROJECTS
                    </StyledButton>
                  ) : (
                    <StyledButton
                      component={NavLink}
                      to={'/projects'}
                      onClick={() => setSelected(2)}
                    >
                      PROJECTS
                    </StyledButton>
                  )}

                  {/* ................ */}

                  {/* <StyledButton
                      component={NavLink}
                      to="/useradmin"
                      // sx={selected === 1 && active.button}
                      sx={selected === 1 ? active.button : ''}
                      onClick={() => setSelected(1)}
                    >
                      ADMIN
                    </StyledButton> */}
                  {/* <StyledButton
                      component={NavLink}
                      to={"/projects"}
                      sx={selected === 2 ? active.button : ''}
                      onClick={() => setSelected(2)}
                    >
                      PROJECTS
                    </StyledButton> */}
                    
                    {/* ................ */}
                </>
              )}
              {auth?.user?.accessLevel === 'user' && (
                <>
                  <StyledButton
                    component={NavLink}
                    to={'/projects' || '/project'}
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

    //     {/* {props.location.pathname === '/' ||
    //     props.location.pathname === '/success' ? (
    //       <div className="navbar-logo grow">
    //         <img src="/hflalogo.png" alt="Hack for LA Logo"></img>
    //       </div>
    //     ) : (
    //       <div
    //         className={`navbar-logo ${
    //           props.location.pathname === '/admin' && 'justify-right'
    //         }`}
    //       >
    //         <img src="/hflalogo.png" alt="Hack for LA Logo"></img>
    //       </div>
    //     )} */}
    //   {/* </nav> */}
    // </div>
  );
};

export default withRouter(Navbar);
