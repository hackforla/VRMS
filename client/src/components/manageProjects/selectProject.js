import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../sass/ManageProjects.scss';
import AddNewProject from '../user-admin/AddNewProject';

const SelectProject = ({ projects, accessLevel, user }) => {
  // If access level is 'admin', display all active projects.
  // If access level is 'user' display user managed projects.
  const [toggle, setToggle] = useState(true);

  const handleToggle = () => { setToggle(!toggle) };

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
      <h3>Project Management</h3>
      <div className="project-sub-heading">
        {accessLevel === 'admin' ? (
          // <Link to="useradmin">
          <>
            <button
              className={`button ${toggle && 'active'}`}
              style={{
                fontSize: 'small',
                width: 'auto',
              }}
              value='findProject'
              onClick={handleToggle}
            >
              Find Project
            </button>
            {/* <Link to="useradmin"> */}

            <button
              type="button"
              className={`button ${!toggle && 'active'}`}
              style={{
                fontSize: 'small',
                width: 'auto',
              }}
              onClick={handleToggle}
            >
              Add a Project
            </button>
          </>
          // </Link>
        ) : null}
      </div>
      <div>
        {toggle
          ? <>
            <input placeholder="Search Projects"
              className="search-field" />
            <ul className="project-list">{managedProjects}</ul>
          </>
          : <AddNewProject />
        }
      </div>
    </div>
  );
};



export default SelectProject;
