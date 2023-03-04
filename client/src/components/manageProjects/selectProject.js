import React from 'react';
import { Link } from 'react-router-dom';
import '../../sass/ManageProjects.scss';

const SelectProject = ({ projects, accessLevel, user }) => {
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
        <Link className="project-list-button" to={`/project/${p._id}`}>
          {p.name ? p.name : '[unnamed project]'}
        </Link>
      </li>
    ));

  return (
    <div className="container--ManageProjects">
      <h3>Manage Projects</h3>
      <div className="project-sub-heading" style={{ margin: '0 auto' }}>
        {accessLevel === 'admin' &&
          <Link to="useradmin">
            {' '}
            <button
              type="button"
              className="button"
              style={{
                fontSize: 'small',
                width: 'auto',
              }}
            >
              Add a Project
            </button>
          </Link>
        }
      </div>
      <div className="project-sub-heading">Select project to edit</div>
      <ul className="project-list">{managedProjects}</ul>
    </div>
  );
};

export default SelectProject;
