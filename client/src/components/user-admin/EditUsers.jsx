import { useEffect, useState } from 'react';
import {
  Grid,
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import '../../sass/UserAdmin.scss';
import useAuth from '../../hooks/useAuth';
import { ROLES } from '../../../../shared/roles';

// child of UserAdmin. Displays form to update users.
const EditUsers = ({
  userToEdit,
  backToSearch,
  updateUserDb,
  projects,
  updateUserActiveStatus,
  updateUserAccessLevel,
}) => {
  const { isAdmin, isSuperAdmin } = useAuth();

  const [userManagedProjects, setUserManagedProjects] = useState([]); //  The projects that the selected user is assigned
  const [projectValue, setProjectValue] = useState(''); // State and handler for form in EditUsers
  const [isActive, setIsActive] = useState(userToEdit.isActive);
  const [admin, setAdmin] = useState(isAdmin());

  // Boolean to check if the current user is the super admin
  const superAdmin = isSuperAdmin();

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
    userProjects.includes(item[0]),
  );

  const onSubmit = (event) => {
    event.preventDefault();

    if (
      !superAdmin &&
      projectValue.length > 0 &&
      projectValue !== 'default' &&
      !userManagedProjects.includes(projectValue)
    ) {
      const newProjects = [...userManagedProjects, projectValue];
      updateUserDb(userToEdit, projectValue, 'add');
      setUserManagedProjects(newProjects);
      setProjectValue('');
    } else {
      setProjectValue('');
    }
  };

  const handleRemoveProject = (projectToRemove) => {
    if (!superAdmin && userManagedProjects.length > 0) {
      const newProjects = userManagedProjects.filter(
        (p) => p !== projectToRemove,
      );
      updateUserDb(userToEdit, projectToRemove, 'remove');
      setUserManagedProjects(newProjects);
    }
  };

  const handleSetIsActive = () => {
    if (!superAdmin) {
      setIsActive(!isActive);
      updateUserActiveStatus(userToEdit, !isActive);
    }
  };

  const handleSetAccessLevel = () => {
    if (!superAdmin) {
      const newAccessLevel = admin ? ROLES.USER : ROLES.ADMIN;
      setAdmin(!admin);
      updateUserAccessLevel(userToEdit, newAccessLevel);
    }
  };

  return (
    <Container className="edit-users">
      <Typography variant="body1">Name: {userName}</Typography>
      <Typography variant="body1">Email: {userEmail}</Typography>
      <FormGroup row alignItems="center">
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          Is Active:
        </Typography>
        <FormControlLabel
          sx={{ marginLeft: 1 }}
          control={
            <Switch
              checked={isActive}
              onChange={handleSetIsActive}
              disabled={superAdmin}
            />
          }
          label={isActive.toString()}
        />
      </FormGroup>
      <FormGroup row alignItems="center">
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          VRMS Admin:
        </Typography>
        <FormControlLabel
          sx={{ marginLeft: 1 }}
          control={
            <Switch
              checked={admin || superAdmin}
              onChange={handleSetAccessLevel}
              disabled={superAdmin}
            />
          }
          label={admin || superAdmin ? 'Yes' : 'No'}
        />
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
                  disabled={superAdmin}
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
          disabled={superAdmin}
        >
          <MenuItem value="default">Select a project..</MenuItem>
          {activeProjects.map((result) => (
            <MenuItem key={`select_${result[0]}`} value={result[0]}>
              {result[1]}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          onClick={onSubmit}
          style={{ marginTop: '1rem' }}
          disabled={superAdmin}
        >
          Add project
        </Button>
      </FormControl>
      <Button
        variant="outlined"
        onClick={backToSearch}
        style={{ marginTop: '1rem' }}
      >
        Back to search
      </Button>
    </Container>
  );
};

export default EditUsers;
