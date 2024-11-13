import React, { useEffect, useState } from 'react';
import '../../sass/UserAdmin.scss';
import { FormGroup, FormControlLabel, Switch } from '@mui/material';

// child of UserAdmin. Displays form to update users.
const EditUsers = ({ userToEdit, backToSearch, updateUserDb, projects, updateUserActiveStatus, updateUserAccessLevel }) => {
  const [userManagedProjects, setUserManagedProjects] = useState([]); //  The projects that the selected user is assigned
  const [projectValue, setProjectValue] = useState(''); // State and handler for form in EditUsers
  const [isActive, setIsActive] = useState(userToEdit.isActive);
  const [isAdmin, setIsAdmin] = useState(userToEdit.accessLevel === "admin");

  // Boolean to check if the current user is the super admin
  const isSuperAdmin = userToEdit.accessLevel === "superadmin";

  // Prepare data for display
  const userName = `${userToEdit.name?.firstName} ${userToEdit.name?.lastName}`;
  const userEmail = userToEdit.email;
  const userProjects = userManagedProjects || [];

  // Filter active projects for dropdown
  const activeProjects = Object.values(projects)
    .filter((project) => project.projectStatus === 'Active')
    .sort((a, b) => a.name?.localeCompare(b.name))
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

    if (!isSuperAdmin && projectValue.length > 0 && projectValue !== 'default' && !userManagedProjects.includes(projectValue)) {
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
    if (!isSuperAdmin && userManagedProjects.length > 0) {
      const newProjects = userManagedProjects.filter((p) => p !== projectToRemove);
      updateUserDb(userToEdit, newProjects);
      setUserManagedProjects(newProjects);
    }
  };

  const handleSetIsActive = () => {
    if (!isSuperAdmin) {
      setIsActive(!isActive);
      updateUserActiveStatus(userToEdit, !isActive);
    }
  };

  const handleSetAccessLevel = () => {
    if (!isSuperAdmin) {
      const newAccessLevel = isAdmin ? "user" : "admin";
      setIsAdmin(!isAdmin);
      updateUserAccessLevel(userToEdit, newAccessLevel);
    }
  };

  return (
    <div className="edit-users">
      <div className="ua-row">
        <div className="user-display-column-left">Name:</div>
        <div className="user-display-column-right">{userName}</div>
      </div>
      <div className="ua-row">
        <div className="user-display-column-left">Email:</div>
        <div className="user-display-column-right">{userEmail}</div>
      </div>
      <div className="ua-row toggle-flex">
        <div className="user-toggle-column-left">Is Active:</div>
        <div className="toggle-flex">
          <span className="toggle-status">{isActive.toString()}</span>
          <FormGroup>
            <FormControlLabel 
              disabled={isSuperAdmin} 
              control={<Switch checked={isActive} />} 
              onClick={handleSetIsActive} 
            />
          </FormGroup>
        </div>
      </div>
      <div className="ua-row toggle-flex">
        <div className="user-toggle-column-left">VRMS Admin:</div>
        <div className="toggle-flex">
          <span className="toggle-status">{isAdmin || isSuperAdmin ? "Yes" : "No"}</span>
          <FormGroup>
            <FormControlLabel 
              disabled={isSuperAdmin} 
              control={<Switch checked={isAdmin || isSuperAdmin} />} 
              onClick={handleSetAccessLevel} 
            />
          </FormGroup>
        </div>
      </div>
      <div className="ua-row">
        <div className="user-display-column-left">Projects:</div>
        <div className="user-display-column-right">
          <ul className="project-list">
            {userProjectsToDisplay.map((result) => {
              return (
                <li key={`remove_${result[0]}`}>
                  {result[1]}
                  <button
                    type="button"
                    className="button-remove"
                    disabled={isSuperAdmin}
                    onClick={() => handleRemoveProject(result[0])}
                  >
                    (remove)
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div>
        <form onSubmit={onSubmit}>
          <select
            className="project-select"
            value={projectValue}
            onChange={(event) => {
              setProjectValue(event.target.value);
            }}
            disabled={isSuperAdmin}
          >
            <option value="default">Select a project..</option>
            {activeProjects.map((result) => {
              return (
                <option key={`select_${result[0]}`} value={result[0]}>
                  {result[1]}
                </option>
              );
            })}
          </select>
          <button className={`button-add ${isSuperAdmin ? 'button-add-disabled' : ''}`}
            type="submit"
            disabled={isSuperAdmin}>
            Add project
          </button>
        </form>
        <div>
          <button type="button" className="button-back" onClick={backToSearch}>
            Back to search  
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUsers;
