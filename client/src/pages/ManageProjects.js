import React, { useCallback, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import '../sass/ManageProjects.scss';
import useAuth from '../hooks/useAuth';
import { REACT_APP_CUSTOM_REQUEST_HEADER } from '../utils/globalSettings';
import SelectProject from '../components/manageProjects/selectProject.js';
import EditProject from '../components/manageProjects/editProject.js';

const ManageProjects = () => {
  const headerToSend = REACT_APP_CUSTOM_REQUEST_HEADER;

  const { auth } = useAuth();
  const [projects, setProjects] = useState([]);
  const [projectToEdit, setProjectToEdit] = useState([]);
  const [recurringEvents, setRecurringEvents] = useState([]);
  const [componentToDisplay, setComponentToDisplay] = useState(''); // displayProjectInfo, editMeetingTime or editProjectInfor
  const user = auth?.user;

  // Fetch projects from db
  const fetchProjects = useCallback(async () => {
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
  }, [headerToSend]);

  // Fetch recurringEvents
  const fetchRecurringEvents = useCallback(async () => {
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
  }, [headerToSend]);
  
  useEffect(() => {
    fetchProjects();
    fetchRecurringEvents();
  }, [fetchProjects, fetchRecurringEvents]);

  function renderUpdatedProj(updatedProj) {
    let updatedProjList = projects;
    let index = updatedProjList.findIndex(
      (proj) => proj._id === updatedProj._id
    );
    updatedProjList[index] = updatedProj;

    setProjects(updatedProjList);
    setProjectToEdit(updatedProj);
  }

  // If not logged in, redirect to login page
  if (!auth && !auth?.user) {
    return <Redirect to="/login" />;
  }

  const projectSelectClickHandler = (project) => (event) => {
    setProjectToEdit(project);
    setComponentToDisplay('editProjectInfo');
  };

  const goSelectProject = () => {
    setComponentToDisplay('selectProject');
  };

  switch (componentToDisplay) {
    case 'editMeetingTime':
      // <EditMeetingTime /> // Placeholder for future coponent
      break;
    case 'editProjectInfo':
      return (
        <EditProject
          projectToEdit={projectToEdit}
          goSelectProject={goSelectProject}
          recurringEvents={recurringEvents}
          renderUpdatedProj={renderUpdatedProj}
          userAccessLevel={user.accessLevel}
        />
      );
    default:
      return (
        <SelectProject
          projectSelectClickHandler={projectSelectClickHandler}
          accessLevel={user?.accessLevel}
          projects={projects}
          user={user}
        />
      );
  }
};

export default ManageProjects;
