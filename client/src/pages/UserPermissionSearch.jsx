import React, { useState, useEffect } from 'react';
import {Box, Button, ButtonGroup, Grid, TextField, Typography, List, ListItem, ListItemButton} from '@mui/material';
import { useLocation } from 'react-router-dom';

import '../sass/UserAdmin.scss';

const Buttonsx = {
  px: 2,
  py: 0.5,
}

const dummyData = [
  {
    "_id": 1,
    "name": {
      "firstName": "John",
      "lastName": "Doe",
    },
    "accessLevel": "admin",
    "email": "johndoe@hackforla.org",
    "projects": []
  },
  {
    "_id": 2,
    "name": {
      "firstName": "Vinny",
      "lastName": "Harris",
    },
    "accessLevel": "admin",
    "email": "vinnyharris@hackforla.org",
    "projects": []
  },
  {
    "_id": 3,
    "name": {
      "firstName": "Gary",
      "lastName": "Jones",
    },
    "accessLevel": "admin",
    "email": "garyjones@hackforla.org",
    "projects": []
  },
  {
    "_id": 4,
    "name": {
      "firstName": "Jane",
      "lastName": "Smith",
    },
    "accessLevel": "projectLead",
    "email": "janesmith@hackforla.org",
    "projects": ["VRMS", "Mobile"]
  },
  {
    "_id": 5,
    "name": {
      "firstName": "Bonnie",
      "lastName": "Wolfe",
    },
    "accessLevel": "projectLead",
    "email": "bonnie@hackforla.org",
    "projects": ["Home Unite Us"]
  },
  {
    "_id": 6,
    "name": {
      "firstName": "Diana",
      "lastName": "Loeb",
    },
    "accessLevel": "projectLead",
    "email": "dianaloeb@hackforla.org",
    "projects": ["HackforLA Mobile", "LA TDM Calculator"]
  },
  {
    "_id": 7,
    "name": {
      "firstName": "Zack",
      "lastName": "Cruz",
    },
    "accessLevel": "projectLead",
    "email": "dianaloeb@hackforla.org",
    "projects": ["LA TDM Calculator", "VRMS backend"]
  },
  {
    "_id": 8,
    "name": {
      "firstName": "Iris",
      "lastName": "Sosa",
    },
    "accessLevel": "projectLead",
    "email": "irissosa@hackforla.org",
    "projects": ["Home Unite Us", "VRMS Support"]
  },
];

const DummyComponent = ({ data, type }) => {
  return (
    <List className="search-results disablePadding">
        {data.map((user, index) => {
          // Destructure user object
          const { _id, name, email } = user;
          return type === 'admin' ?
            (
              <ListItem
                sx={{
                  px: 2.4,
                  py: 1,
                  borderBottom: 1.6,
                  borderBottomColor: 'grey.300',
                }} 
                key={`result_${_id}/${index}`}>
                <ListItemButton
                  sx={{
                    px: 0.25,
                    py: 0.36,
                    color: 'primary.main',
                    mx: 0.16,
                  }}
                  className="search-results-button"
                  type="button"
                  onClick={() => setUserToEdit(user)}
                >
                  <Grid container>
                    <Grid item>
                      <Typography style={{fontWeight: 600}}>
                        {`${name.firstName.toUpperCase()} ${name.lastName.toUpperCase()} ( ${email.toUpperCase()} )`}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItemButton>
              </ListItem>
            ) : 
              <ListItem
                style={{display: 'flex', justifyContent: 'flex-end'}}
                sx={{
                  px: 2.4,
                  py: 1,
                  borderBottom: 1.6,
                  borderBottomColor: 'grey.300',
                }} 
                key={`result_${_id}/${index}`}>
                <ListItemButton
                  sx={{
                    px: 0.25,
                    py: 0.36,
                    color: 'primary.main',
                    mx: 0.16,
                  }}
                  className="search-results-button"
                  type="button"
                  onClick={() => setUserToEdit(user)}
                >
                  <Grid container justifyContent={"space-between"}>
                    <Grid item>
                      <Typography style={{fontWeight: 600}}>{name.firstName.toUpperCase() + " " + name.lastName.toUpperCase()}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography style={{fontWeight: 600}} color='black'>{user.project}</Typography>
                    </Grid>
                  </Grid>
                </ListItemButton>
              </ListItem>
            })
          }
      </List>
  )
}


const UserPermissionSearch = ({ users, setUserToEdit }) => {
  const [userType, setUserType] = useState('admin'); // Which results will display
  const [searchText, setSearchText] = useState(''); // Search term for the admin/PM search

  const location = useLocation();

  useEffect(() => {
    // Edits url by adding '/admin' upon loading
    let editURL = '';
    if (userType === 'admin') {
      editURL = location.pathname + '/admin';
    } else {
      editURL = location.pathname + '/projects';
    }
    window.history.replaceState({}, "", editURL);
  }, [userType]);


  // Swaps the buttons and displayed panels for the search results, by email or by name
  const buttonSwap = () =>
    userType === 'projectLead'
      ? setUserType('admin')
      : setUserType('projectLead');

  // Handle change on input in search form
  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  // Filtering logic
  let filteredData;
  if (!searchText) {
    filteredData = dummyData.filter((user) => user.accessLevel === userType);
    if (userType === 'admin') {
      // Default display for admins, sorted ASC based on first name
      filteredData.sort((u1, u2) => u1.name?.firstName.localeCompare(u2.name?.firstName))
    } else {
      // Default display of all PMs, sorted ASC based on project name, then first name
      let tempFilter = [];
      filteredData.forEach((user) => {
        user.projects.forEach((project) => {
          tempFilter.push({ ...user, project })
        })
      })
      tempFilter.sort((u1, u2) => u1.project.localeCompare(u2.project) || u1.name?.firstName.localeCompare(u2.name?.firstName))
      filteredData = [...tempFilter];
    }
  }

  return (
    <Box className="container--usermanagement" sx={{px: '1.8rem', mb: 0,}}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 5,
        height: '100%',
        width: 1/1,
      }}>
        <Typography variant="h4" style={{marginBottom: 20, fontWeight: 'bold'}}>User Permission Search</Typography>
        <Box className="tab-buttons">
          <ButtonGroup fullWidth sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            mx: 1,
          }}>
              <Button
                sx={Buttonsx}
                type="button"
                variant={
                  userType === 'admin'
                  ? 'contained'
                  : 'secondary'
                }
                onClick={buttonSwap}
              >
                Admins
              </Button>
              <Button
                sx={Buttonsx}
                type="button"
                variant={
                  userType === 'projectLead'
                  ? 'contained'
                  : 'secondary'
                }
                onClick={buttonSwap}
              >
                Project Leads
              </Button>
          </ButtonGroup>
        </Box>
        <TextField
          type="text"
          placeholder={userType === "admin" ? "Search name" : "Search name or project"}
          variant='standard'
          value={searchText}
          onChange={handleChange}
        />
        <Box sx={{ 
          bgcolor: dummyData.length>0? '#F5F5F5': 'transparent',
          my: 1.2,
          borderRadius: 1,
          flexGrow: 1,
          width: 1/1,
          }}>
          <Box>
            {/*Component to render admins and PMs*/}
            <DummyComponent data={filteredData} type={userType} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserPermissionSearch;
