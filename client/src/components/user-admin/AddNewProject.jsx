import React, { useState } from 'react';
import '../../sass/UserAdmin.scss';
import { Redirect } from 'react-router-dom';

const AddNewProject = ({
  projects,
  onBackClick,
  handleNewProjectFormSubmit,
  newlyCreatedProject
}) => {
  // initialize state hooks
  const [newProjectName, setNewProjectName] = useState(''); // manage input state
  const [validationError, setValidationErrors] = useState(''); // validation errors
  const [addProjectSuccess, setAddProjectSuccess] = useState(''); // project successfully added to db

  // Handle input change
  const handleNameChange = (event) => {
    setNewProjectName(event.target.value);
  };

  if (newlyCreatedProject !== null) {
    return <Redirect to={`/project/${newlyCreatedProject}`} />
  }

  // Handle Form Submit
  const handleProjectFormSubmit = (event) => {
    event.preventDefault();

    // Clear notifications on resubmit
    setValidationErrors('');
    setAddProjectSuccess('');

    // Validation

    // If there's no project name don't do anything
    if (!newProjectName) {
      setValidationErrors(`Project name is required`);
      return;
    }

    // If the entry already exists in the db, set error and clear form
    const validationMatch = Object.values(projects)
      .filter(
        (project) =>
          project.name.toLowerCase() === newProjectName.toLowerCase().trim()
      )
      .map((p) => p.name);
    if (validationMatch.length > 0) {
      setValidationErrors(
        `The project name "${newProjectName}" is already in use.`
      );
      setNewProjectName(''); // clear the form
    } else {
      handleNewProjectFormSubmit(newProjectName);
      setNewProjectName(''); // clear the form
      setAddProjectSuccess(`The project "${newProjectName}" has been added!`);
    }
  };
  
  return (
    <div className="add-new-project">
      <h3>Add New Project</h3>
      <div>
        <form onSubmit={handleProjectFormSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Project Name"
              value={newProjectName}
              onChange={handleNameChange}
              />
            <span className="validation-error">{validationError}</span>
            <span className="project-success">{addProjectSuccess}</span>
              { newlyCreatedProject && <div>{newlyCreatedProject}</div>}
          </div>
          <br />
          <button className="button-add" type="submit">
            Add Project
          </button>
        </form>
      </div>
      <div>
        <button type="button" className="button-back" onClick={onBackClick}>
          Admin Dashboard
        </button>
      </div>
    </div>
  );
}; // End AddNewProject

export default AddNewProject;
