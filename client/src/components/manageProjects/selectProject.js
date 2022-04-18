import React from 'react';
import '../../sass/ManageProjects.scss';

const SelectProject = ({
  projects,
  accessLevel,
  user,
  projectSelectClickHandler,
}) => {
  // If access level is 'admin', display all active projects.
  // If access level is 'user' display user managed projects.
  const managedProjects = projects
    ?.filter((proj) => {
      if (accessLevel === 'admin') {
        return proj.projectStatus === 'Active';
      }

      // accessLevel is user
      // eslint-disable-next-line no-underscore-dangle
      return user?.managedProjects.includes(proj._id);
    })
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((p) => (
      // eslint-disable-next-line no-underscore-dangle
      <li className="project-list-item" key={p._id}>
        <button
          className="project-list-button"
          type="button"
          onClick={projectSelectClickHandler(p)}
        >
          {p.name ? p.name : '[unnamed project]'}
        </button>
      </li>
    ));

  return (
    <div className="container--ManageProjects">
      <h3>Manage Projects</h3>
      <div className="project-sub-heading">Select project to edit</div>
      <ul className="project-list">{managedProjects}</ul>
      <button className="btn-add-new-project">Add New Project</button>
    </div>
  );
};

export default SelectProject;
