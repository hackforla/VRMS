import React, { useState, useEffect, useCallback } from 'react';
import Alert from 'react-bootstrap/Alert';
import { Redirect } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import SelectProject from '../components/manageProjects/selectProject';
import EditProject from '../components/manageProjects/editProject';
import ProjectApiService from '../api/ProjectApiService';
import RecurringEventsApiService from '../api/RecurringEventsApiService';
import Loading from '../svg/22.gif';
import '../sass/ManageProjects.scss';

import 'bootstrap/dist/css/bootstrap.min.css';

const PAGES = Object.freeze({
  selectProject: 'selectProject',
  editProjectInfo: 'editProjectInfo',
  editMeetingTimes: 'editMeetingTimes',
});

const ManageProjects = () => {
  const { auth } = useAuth();
  const [projects, setProjects] = useState();
  const [projectToEdit, setProjectToEdit] = useState([]);
  const [recurringEvents, setRecurringEvents] = useState();
  const [componentToDisplay, setComponentToDisplay] = useState('');
  const [projectApiService] = useState(new ProjectApiService());
  const [recurringEventsApiService] = useState(new RecurringEventsApiService());
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);

  const user = auth?.user;

  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    const projectRes = await projectApiService.fetchProjects();
    setProjects(projectRes);
    setProjectsLoading(false);
  }, [projectApiService]);

  const fetchRecurringEvents = useCallback(async () => {
    setEventsLoading(true);
    const eventsRes = await recurringEventsApiService.fetchRecurringEvents();
    setRecurringEvents(eventsRes);
    setEventsLoading(false);
  }, [recurringEventsApiService]);

  const updateProject = useCallback(
    async (fieldName, fieldValue) => {
      await projectApiService.updateProject(
        // eslint-disable-next-line no-underscore-dangle
        projectToEdit._id,
        fieldName,
        fieldValue
      );
      fetchProjects();
    },
    [projectApiService, fetchProjects, projectToEdit]
  );

  const createNewRecurringEvent = useCallback(
    async (eventToCreate) => {
      await recurringEventsApiService.createNewRecurringEvent(eventToCreate);
      fetchRecurringEvents();
    },
    [recurringEventsApiService, fetchRecurringEvents]
  );

  const deleteRecurringEvent = useCallback(
    async (recurringEventID) => {
      await recurringEventsApiService.deleteRecurringEvent(recurringEventID);
      fetchRecurringEvents();
    },
    [recurringEventsApiService, fetchRecurringEvents]
  );

  const updateRecurringEvent = useCallback(
    async (eventToUpdate, recurringEventID) => {
      await recurringEventsApiService.updateRecurringEvent(
        eventToUpdate,
        recurringEventID
      );
      fetchRecurringEvents();
    },
    [recurringEventsApiService, fetchRecurringEvents]
  );

  useEffect(() => {
    // Refresh project to edit, if projects have been refreshed
    if (projectToEdit && projects) {
      setProjectToEdit(
        projects.find(
          // eslint-disable-next-line no-underscore-dangle
          (proj) => proj._id === projectToEdit._id
        )
      );
    }
  }, [projectToEdit, projects, setProjectToEdit]);

  useEffect(() => {
    fetchProjects();
    fetchRecurringEvents();
  }, [fetchProjects, fetchRecurringEvents]);

  // If not logged in, redirect to login page
  if (!auth && !auth?.user) {
    return <Redirect to="/login" />;
  }

  const projectSelectClickHandler = (project) => () => {
    setProjectToEdit(project);
    setComponentToDisplay(PAGES.editProjectInfo);
  };

  const goSelectProject = () => {
    setProjectToEdit([]);
    setComponentToDisplay(PAGES.selectProject);
  };

  let displayedComponent;

  switch (componentToDisplay) {
    case PAGES.editProjectInfo:
      displayedComponent = (
        <EditProject
          projectToEdit={projectToEdit}
          goSelectProject={goSelectProject}
          recurringEvents={recurringEvents}
          updateProject={updateProject}
          userAccessLevel={user.accessLevel}
          createNewRecurringEvent={createNewRecurringEvent}
          deleteRecurringEvent={deleteRecurringEvent}
          updateRecurringEvent={updateRecurringEvent}
        />
      );
      break;
    default:
      displayedComponent = (
        <SelectProject
          projectSelectClickHandler={projectSelectClickHandler}
          accessLevel={user?.accessLevel}
          projects={projects}
          user={user}
        />
      );
      break;
  }
  return (
    <>
      <span
        className={`bg-overlay ${
          eventsLoading || projectsLoading ? 'active' : ''
        }`}
      >
        <img src={Loading} alt="Logo" />
      </span>
      {displayedComponent}
    </>
  );
};

export default ManageProjects;
