import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemButton,
} from '@mui/material';
import { useLocation } from 'react-router-dom';

import '../../sass/UserAdmin.scss';

const Buttonsx = {
  px: 2,
  py: 0.5,
};

const DummyComponent = ({ data, isProjectLead, setUserToEdit }) => {
  return (
    <List className="search-results disablePadding">
      {data.map((u, idx) => {
        // Destructure user object
        const { _id, name, email } = u;
        // return projects.length === 0 ?
        return !isProjectLead ? (
          <ListItem
            sx={{
              px: 2.4,
              py: 1,
              borderBottom: 1.6,
              borderBottomColor: 'grey.300',
            }}
            key={`result_${_id}/${idx}`}
          >
            <ListItemButton
              sx={{
                px: 0.25,
                py: 0.36,
                color: 'primary.main',
                mx: 0.16,
              }}
              className="search-results-button"
              type="button"
              onClick={() => setUserToEdit(u)}
            >
              <Grid container>
                <Grid item>
                  <Typography style={{ fontWeight: 600 }}>
                    {`${name.firstName.toUpperCase()} ${name.lastName.toUpperCase()} ( ${email.toUpperCase()} )`}
                  </Typography>
                </Grid>
              </Grid>
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem
            style={{ display: 'flex', justifyContent: 'flex-end' }}
            sx={{
              px: 2.4,
              py: 1,
              borderBottom: 1.6,
              borderBottomColor: 'grey.300',
            }}
            key={`result_${_id}/${idx}`}
          >
            <ListItemButton
              sx={{
                px: 0.25,
                py: 0.36,
                color: 'primary.main',
                mx: 0.16,
              }}
              className="search-results-button"
              type="button"
              onClick={() => setUserToEdit(u)}
            >
              <Grid container justifyContent={'space-between'}>
                <Grid item>
                  <Typography style={{ fontWeight: 600 }}>
                    {name.firstName.toUpperCase() +
                      ' ' +
                      name.lastName.toUpperCase()}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography style={{ fontWeight: 600 }} color="black">
                    {u.managedProjectName}
                  </Typography>
                </Grid>
              </Grid>
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

const UserPermissionSearch = ({ admins, projectLeads, setUserToEdit }) => {
  const [userType, setUserType] = useState('admin'); // Which results will display
  const [searchText, setSearchText] = useState(''); // Search term for the admin/PM search
  const [isProjectLead, setIsProjectLead] = useState(false);

  const location = useLocation();

  const resultData = [...admins, ...projectLeads];

  useEffect(() => {
    // Edit url by adding '/admin' upon loading
    let editURL = '';
    if (userType === 'admin') {
      editURL = location.pathname + '/admin';
    } else {
      editURL = location.pathname + '/projects';
    }
    window.history.replaceState({}, '', editURL);
  }, [userType]);

  // Swaps the buttons and displayed panels for the search results, by email or by name
  const buttonSwap = () =>
    isProjectLead ? setIsProjectLead(false) : setIsProjectLead(true);

  // Handle change on input in search form
  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  const getFilteredData = (resultData, searchText, isProjectLead) => {
    const searchTextLowerCase = searchText.trim().toLowerCase();

    let filteredData = resultData
      .filter((user) =>
        isProjectLead
          ? user.isProjectLead === true
          : user.isProjectLead === undefined
      )
      .flatMap((user) =>
        isProjectLead && user.managedProjectNames.length > 0
          ? user.managedProjectNames.map((managedProjectName) => ({
              ...user,
              managedProjectName,
            }))
          : [{ ...user }]
      )
      .filter((user) => {
        const fullName =
          `${user.name.firstName} ${user.name.lastName}`.toLowerCase();
        const projectName = user.managedProjectName
          ? user.managedProjectName.toLowerCase()
          : '';
        return (
          fullName.includes(searchTextLowerCase) ||
          (isProjectLead && projectName.includes(searchTextLowerCase))
        );
      });

    return filteredData.sort((a, b) => {
      if (isProjectLead) {
        return (
          a.managedProjectName.localeCompare(b.managedProjectName) ||
          a.name.firstName.localeCompare(b.name.firstName)
        );
      }
      return a.name.firstName.localeCompare(b.name.firstName);
    });
  };

  // Filtering logic
  let filteredData;
  if (!searchText) {
    filteredData = resultData.filter((user) =>
      isProjectLead
        ? user.isProjectLead === true
        : user.isProjectLead === undefined
    );

    if (!isProjectLead) {
      // Default display for admins, sorted ASC based on first name
      filteredData.sort((u1, u2) =>
        u1.name?.firstName.localeCompare(u2.name?.firstName)
      );
    } else {
      // Default display of all PMs, sorted ASC based on project name, then first name
      let tempFilter = [];
      filteredData.forEach((user) => {
        user.managedProjectNames.forEach((managedProjectName) => {
          tempFilter.push({ ...user, managedProjectName });
        });
      });
      tempFilter.sort(
        (u1, u2) =>
          u1.managedProjectName.localeCompare(u2.managedProjectName) ||
          u1.name?.firstName.localeCompare(u2.name?.firstName)
      );
      filteredData = [...tempFilter];
    }
  } else {
    // NOTE: Using "users" instead of "dummyData" to check the link to user profile
    filteredData = getFilteredData(resultData, searchText, isProjectLead);
  }

  return (
    <Box className="container--usermanagement" sx={{ px: '1.8rem', mb: 0 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 5,
          height: '100%',
          width: 1 / 1,
        }}
      >
        <Typography
          variant="h4"
          style={{ marginBottom: 20, fontWeight: 'bold' }}
        >
          User Permission Search
        </Typography>
        <Box className="tab-buttons">
          <ButtonGroup
            fullWidth
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              mx: 1,
            }}
          >
            <Button
              sx={Buttonsx}
              type="button"
              variant={!isProjectLead ? 'contained' : 'secondary'}
              onClick={buttonSwap}
            >
              Admins
            </Button>
            <Button
              sx={Buttonsx}
              type="button"
              variant={isProjectLead ? 'contained' : 'secondary'}
              onClick={buttonSwap}
            >
              Project Leads
            </Button>
          </ButtonGroup>
        </Box>
        <TextField
          type="text"
          placeholder={isProjectLead ? 'Search name or project' : 'Search name'}
          variant="standard"
          value={searchText}
          onChange={handleChange}
        />
        <Box
          sx={{
            bgcolor: admins.length > 0 ? '#F5F5F5' : 'transparent',
            my: 1.2,
            borderRadius: 1,
            flexGrow: 1,
            width: 1 / 1,
          }}
        >
          <Box>
            {/*Component to render admins and PMs*/}
            <DummyComponent
              data={filteredData}
              isProjectLead={isProjectLead}
              setUserToEdit={setUserToEdit}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserPermissionSearch;
