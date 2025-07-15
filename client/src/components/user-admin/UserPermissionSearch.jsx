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

const buttonSX = {
  adminButton: {
    px: 2,
    py: 0.5,
  },
  projMemsButton: {
    px: 6,
    py: 0.5,
  }
};

const ListComponent = ({ data, isProjectMember, setUserToEdit }) => {
  return (
    <List className="search-results disablePadding">
      {data.map((user, idx) => {
        // Destructure user object
        const { _id, name, email } = user;
        // return projects.length === 0 ?
        return !isProjectMember ? (
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
              onClick={() => setUserToEdit(user)}
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
              onClick={() => setUserToEdit(user)}
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
                    {user.managedProjectName}
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
  const [searchText, setSearchText] = useState(''); // Search term for the admin/PM search
  const [isProjectMember, setIsProjectMember] = useState(false);

  const location = useLocation();

  const resultData = [...admins, ...projectLeads];

  useEffect(() => {
    // Edit url by adding '/admin' upon loading
    let editURL = '';
    if (!isProjectMember) {
      editURL = location.pathname + '/admin';
    } else {
      editURL = location.pathname + '/projects';
    }
    window.history.replaceState({}, '', editURL);
  }, [isProjectMember]);

  // Swaps the buttons and displayed panels for the search results, by email or by name
  const buttonSwap = () =>
    isProjectMember ? setIsProjectMember(false) : setIsProjectMember(true);

  // Handle change on input in search form
  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  const getFilteredData = (resultData, searchText, isProjectMember) => {
    const searchTextLowerCase = searchText.trim().toLowerCase();

    let filteredUsers = resultData
      .filter((user) =>
        isProjectMember
          ? user.isProjectMember === true
          : user.isProjectMember === undefined
      )
      .flatMap((user) =>
        isProjectMember && user.managedProjectNames.length > 0
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
          (isProjectMember && projectName.includes(searchTextLowerCase))
        );
      });

    return filteredUsers.sort((a, b) => {
      if (isProjectMember) {
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
      isProjectMember
        ? user.isProjectMember === true
        : user.isProjectMember === undefined
    );

    if (!isProjectMember) {
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
    filteredData = getFilteredData(resultData, searchText, isProjectMember);
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
              sx={buttonSX.adminButton}
              type="button"
              variant={!isProjectMember ? 'contained' : 'secondary'}
              onClick={buttonSwap}
            >
              Admins
            </Button>
            <Button
              sx={buttonSX.projMemsButton}
              type="button"
              variant={isProjectMember ? 'contained' : 'secondary'}
              onClick={buttonSwap}
            >
              Project Members
            </Button>
          </ButtonGroup>
        </Box>
        <TextField
          type="text"
          placeholder={isProjectMember ? 'Search name or project' : 'Search name'}
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
            <ListComponent
              data={filteredData}
              isProjectMember={isProjectMember}
              setUserToEdit={setUserToEdit}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserPermissionSearch;
