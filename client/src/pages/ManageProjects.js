import React, { useState, useEffect } from 'react';
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

  const [issueValue, setIssueValue] = useState({ proposedValue: '' });
  console.log('ManageProjects: issueValue:', issueValue);

  const getIssue = (issue) => {
    console.log('ManageProjects: getIssue: issue: ', issue);

    setIssueValue({ proposedValue: issue.proposedValue });
  };

  console.log(
    'ManageProjects: issueValue: after running the getIssue function:',
    issueValue
  );

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
          getIssue={getIssue}
          issueValue={issueValue.proposedValue}
        />
      );
      break;
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
