import React, { useState } from 'react';
import '../../sass/UserAdmin.scss';

const AddNewProject = ({
  projects,
  onBackClick,
  handleNewProjectFormSubmit,
}) => {
  // initialize state hooks
  const [newProjectName, setNewProjectName] = useState(''); // manage input state
  const [validationError, setValidationErrors] = useState(''); // validation errors
  const [addProjectSuccess, setAddProjectSuccess] = useState(''); // project successfully added to db

  // Handle input change
  const handleNameChange = (event) => {
    setNewProjectName(event.target.value);
  };

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
          </div>
          <br />
          <button className="button-add" type="submit">
            Add Project
          </button>
        </form>
      </div>
    </div>
  );
}; // End AddNewProject

export default AddNewProject;
