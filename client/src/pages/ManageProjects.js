import React, { useState, useEffect } from 'react';
import '../sass/ManageProjects.scss';
import useAuth from '../hooks/useAuth';


const ManageProjects = () => {
  const headerToSend = process.env.REACT_APP_CUSTOM_REQUEST_HEADER;

  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  console.log(user, projects);
  // Fetch projects from db
  async function fetchProjects() {
    try {
      const res = await fetch('/api/projects/', {
        headers: {
          'x-customrequired-header': headerToSend,
        },
      });
      const resJson = await res.json();
      setProjects(resJson);
    } catch (error) {
      console.log(`fetchProjects error: ${error}`);
      alert('Server not responding.  Please refresh the page.');
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const managedProjects = projects.filter((item) =>
    user?.managedProjects.includes(item._id)
  );
  return (
    <div className="container--ManageProjects">
      {/* useAuth for user
        useProjects for projects
        iterate through users managed projects
        make the project a seperate component that allows for updating
      */}
      <h3>Manage Projects</h3>
      {managedProjects.map(project => (
        <p>{project.name}</p>
      ))}
    </div>
  );
};

export default ManageProjects;
