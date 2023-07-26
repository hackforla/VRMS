import React, { useEffect, useState } from 'react';
import '../../sass/UserAdmin.scss';
import { FormGroup, FormControlLabel, Switch } from '@mui/material'

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
    <div className="edit-users">
      <div className="ua-row">
        <div className="user-display-column-left">Name:</div>
        <div className="user-display-column-right">{userName}</div>
      </div>
      <div className="ua-row">
        <div className="user-display-column-left">Email:</div>
        <div className="user-display-column-right">{userEmail}</div>
      </div>
      <div className="ua-row is-active-flex">
        <div className="user-is-active-column-left">Is Active:</div>
        <div className="is-active-flex">
          <span className="active-status">{isActive.toString()}</span>
          <FormGroup>
            <FormControlLabel control={<Switch checked={isActive} /> } onClick={() => handleSetIsActive()} />
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
          <button className="button-add" type="submit">
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
