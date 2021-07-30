import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import '../sass/ManageProjects.scss';
import useAuth from '../hooks/useAuth';

import SelectProject from '../components/manageProjects/selectProject.js';
import EditProjectInfo from '../components/manageProjects/editProject.js';
import EditableField from '../components/manageProjects/editableField';

const ManageProjects = () => {

  const headerToSend = process.env.REACT_APP_CUSTOM_REQUEST_HEADER;

  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [projectToEdit, setProjectToEdit] = useState([]);
  const [recurringEvents, setRecurringEvents] = useState([]);
  const [componentToDisplay, setComponentToDisplay] = useState (''); // editProjectInfo, editMeetingTime or editProjectInfor 

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

    // Fetch recurringEvents
    async function fetchRecurringEvents() {
      try {
        const res = await fetch('/api/recurringEvents/', {
          headers: {
            'x-customrequired-header': headerToSend,
          },
        });
        const resJson = await res.json();
        setRecurringEvents(resJson);
      } catch (error) {
        console.log(`fetchProjects error: ${error}`);
        alert('Server not responding.  Please refresh the page.');
      }
    }

  useEffect(() => {
    fetchProjects();
    fetchRecurringEvents();
  }, []);

  // If not logged in, redirect back home
  if (!user) {
    return <Redirect to="/" />;
  }

  const projectSelectClickHandler = project => event => {
    setProjectToEdit(project);
    setComponentToDisplay('editProjectInfo');
  };

  const goSelectProject = () => {
    setComponentToDisplay('selectProject');
}


  switch (componentToDisplay) {
    case 'editMeetingTime':
      // <EditMeetingTime /> // Placeholder for future coponent
      break;
    case 'editProjectInfo':
      return (
      <EditProjectInfo 
        projectToEdit = {projectToEdit}
        goSelectProject = {goSelectProject}
        recurringEvents = {recurringEvents}
        setProjectToEdit = {setProjectToEdit}
      />
      );
      break;
    default:
      return (
        <SelectProject 
          projectSelectClickHandler = {projectSelectClickHandler}
          accessLevel = {user?.accessLevel}
          projects = {projects}
          user = {user}
        />
      );
  }
};

export default ManageProjects;
