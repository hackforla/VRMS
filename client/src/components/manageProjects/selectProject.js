import React from 'react';
import { Link } from 'react-router-dom';
import '../../sass/ManageProjects.scss';
import { useProjectsStore } from '../../store/projectsStore.js';

import { Button, Typography } from '@mui/material';

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
    .sort((a, b) => a.name?.localeCompare(b.name))
    .map((p) => (
      // eslint-disable-next-line no-underscore-dangle
      <li className="project-list-item" key={p._id}>
        <Link className="project-list-button" to={`/projects/${p._id}`}>
          {p.name ? p.name : '[unnamed project]'}
        </Link>
      </li>
    ));

  return (
    <div className="container--ManageProjects">
      <Typography variant="h3">Project Management</Typography>
      <div className="project-sub-heading" style={{ margin: '0 auto' }}>
        {accessLevel === 'admin' && (
          <Link to="/projects/create">
            {' '}
            <Button variant="secondary" sx={{ mb: 3 }}>
              Add a New Project
            </Button>
          </Link>
        )}
      </div>
      <ul className="project-list">{managedProjects}</ul>
    </div>
  );
};

export default SelectProject;
