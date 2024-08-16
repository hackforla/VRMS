import React, { useEffect, useState } from 'react';
import '../../sass/UserAdmin.scss';
import { FormGroup, FormControlLabel, Switch, Box, Typography, Button, MenuItem, Select, List, ListItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

// child of UserAdmin. Displays form to update users.
const EditUsers = ({ userToEdit, backToSearch, updateUserDb, projects, updateUserActiveStatus }) => {
  const [userManagedProjects, setUserManagedProjects] = useState([]); //  The projects that the selected user is assigned
  const [projectValue, setProjectValue] = useState(''); // State and handler for form in EditUsers
  const [isActive, setIsActive] = useState(userToEdit.isActive);

  // Prepare data for display
  const userName = `${userToEdit.name?.firstName} ${userToEdit.name?.lastName}`;
  const userEmail = userToEdit.email;
  const userProjects = userManagedProjects || [];

  // Filter active projects for dropdown
  const activeProjects = Object.values(projects)
    .filter((project) => project.projectStatus === 'Active')
    .sort((a, b) => a.name?.localeCompare(b.name))
    // eslint-disable-next-line no-underscore-dangle
    .map((p) => [p._id, p.name]);

  // add user projects to state
  useEffect(() => {
    setUserManagedProjects(userToEdit.managedProjects);
  }, [userToEdit]);

  // Prepare user projects for display by connecting the ID with the project name
  const userProjectsToDisplay = activeProjects.filter((item) =>
    userProjects.includes(item[0])
  );

  // Handle the add project form submit
  const onSubmit = (event) => {
    event.preventDefault();

    if (
      projectValue.length > 0 &&
      projectValue !== 'default' &&
      !userManagedProjects.includes(projectValue)
    ) {
      const newProjects = [...userManagedProjects, projectValue];
      updateUserDb(userToEdit, newProjects);
      setUserManagedProjects(newProjects);
      setProjectValue([]);
    } else {
      setProjectValue([]);
    }
  };

  // Remove projects from db
  const handleRemoveProject = (projectToRemove) => {
    if (userManagedProjects.length > 0) {
      const newProjects = userManagedProjects.filter(
        (p) => p !== projectToRemove
      );
      updateUserDb(userToEdit, newProjects);
      setUserManagedProjects(newProjects);
    }
  };

  const handleSetIsActive = () => {
    setIsActive(!isActive)
    updateUserActiveStatus(userToEdit, !isActive)
  }

  return (
    <Box className="edit-users">
      <Box className="ua-row">
        <Box className="user-display-column-left">Name:</Box>
        <Box className="user-display-column-right">{userName}</Box>
      </Box>
      <Box className="ua-row">
        <Box className="user-display-column-left">Email:</Box>
        <Box className="user-display-column-right">{userEmail}</Box>
      </Box>
      <Box className="ua-row is-active-flex">
        <Box className="user-is-active-column-left">Is Active:</Box>
        <Box className="is-active-flex">
          <Typography className="active-status">{isActive.toString()}</Typography>
          <FormGroup>
            <FormControlLabel control={<Switch checked={isActive} onClick={handleSetIsActive} />} />
          </FormGroup>
        </Box>
      </Box>
      <Box className="ua-row">
        <Box className="user-display-column-left">Projects:</Box>
        <Box className="user-display-column-right">
          <List className="project-list">
            {userProjectsToDisplay.map((result) => (
              <ListItem key={`remove_${result[0]}`} secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveProject(result[0])}>
                  <DeleteIcon />
                </IconButton>
              }>
                {result[1]}
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
      <Box>
        <form onSubmit={onSubmit}>
          <Select
            className="project-select"
            value={projectValue}
            onChange={(event) => {
              setProjectValue(event.target.value);
            }}
            displayEmpty
          >
            <MenuItem value="default">Select a project..</MenuItem>
            {activeProjects.map((result) => (
              <MenuItem key={`select_${result[0]}`} value={result[0]}>
                {result[1]}
              </MenuItem>
            ))}
          </Select>
          <Button className="button-add" type="submit" variant="contained" color="primary">
            Add project
          </Button>
        </form>
        <Box>
          <Button className="button-back" onClick={backToSearch} variant="outlined">
            Back to search
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditUsers;
