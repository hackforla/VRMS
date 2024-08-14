import React, { useEffect, useState } from 'react';
import { Grid, FormGroup, FormControlLabel, Switch, Button, Typography, Container, List, ListItem, ListItemText, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import '../../sass/UserAdmin.scss';

const EditUsers = ({ userToEdit, backToSearch, updateUserDb, projects, updateUserActiveStatus }) => {
  const [userManagedProjects, setUserManagedProjects] = useState([]);
  const [projectValue, setProjectValue] = useState('');
  const [isActive, setIsActive] = useState(userToEdit.isActive);

  const userName = `${userToEdit.name?.firstName} ${userToEdit.name?.lastName}`;
  const userEmail = userToEdit.email;
  const userProjects = userManagedProjects || [];

  const activeProjects = Object.values(projects)
    .filter((project) => project.projectStatus === 'Active')
    .sort((a, b) => a.name?.localeCompare(b.name))
    .map((p) => [p._id, p.name]);

  useEffect(() => {
    setUserManagedProjects(userToEdit.managedProjects);
  }, [userToEdit]);

  const userProjectsToDisplay = activeProjects.filter((item) =>
    userProjects.includes(item[0])
  );

  const onSubmit = (event) => {
    event.preventDefault();
    if (projectValue.length > 0 && projectValue !== 'default' && !userManagedProjects.includes(projectValue)) {
      const newProjects = [...userManagedProjects, projectValue];
      updateUserDb(userToEdit, newProjects);
      setUserManagedProjects(newProjects);
      setProjectValue('');
    } else {
      setProjectValue('');
    }
  };

  const handleRemoveProject = (projectToRemove) => {
    const newProjects = userManagedProjects.filter((p) => p !== projectToRemove);
    updateUserDb(userToEdit, newProjects);
    setUserManagedProjects(newProjects);
  };

  const handleSetIsActive = () => {
    setIsActive(!isActive);
    updateUserActiveStatus(userToEdit, !isActive);
  };

  return (
    <Container className="edit-users">
      <Typography variant="body1">Name: {userName}</Typography>
      <Typography variant="body1">Email: {userEmail}</Typography>
      <FormGroup row alignItems="center">
        <Typography variant="body1" sx={{ marginTop: 1 }}>Is Active:</Typography>
        <FormControlLabel sx={{ marginLeft: 1 }} control={<Switch checked={isActive} onChange={handleSetIsActive} />} 
        label={isActive.toString()}/>
      </FormGroup>
      <Typography variant="body1">Projects:</Typography>
      <List>
        {userProjectsToDisplay.map((result) => (
          <ListItem key={`remove_${result[0]}`} divider>
            <Grid container alignItems="center">
              <Grid item xs={9}>
                <ListItemText primary={result[1]} />
              </Grid>
              <Grid item xs={3}>
                <Button 
                  variant="text" 
                  color="error" 
                  onClick={() => handleRemoveProject(result[0])}
                  fullWidth
                >
                  (Remove)
                </Button>
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
      <FormControl fullWidth>
        <InputLabel id="project-select-label">Select a project</InputLabel>
        <Select
          labelId="project-select-label"
          id="project-select"
          value={projectValue}
          label="Select a project"
          onChange={(event) => setProjectValue(event.target.value)}
        >
          <MenuItem value="default">Select a project..</MenuItem>
          {activeProjects.map((result) => (
            <MenuItem key={`select_${result[0]}`} value={result[0]}>
              {result[1]}
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" onClick={onSubmit} style={{ marginTop: '1rem' }}>
          Add project
        </Button>
      </FormControl>
      <Button variant="outlined" onClick={backToSearch} style={{ marginTop: '1rem' }}>
        Back to search
      </Button>
    </Container>
  );
};

export default EditUsers;
