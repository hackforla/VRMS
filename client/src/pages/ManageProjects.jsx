import React, { useState, useEffect, useCallback } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import SelectProject from '../components/manageProjects/selectProject';
import EditProject from '../components/manageProjects/editProject';
import ProjectApiService from '../api/ProjectApiService';
import RecurringEventsApiService from '../api/RecurringEventsApiService';
import Loading from '../svg/22.gif';
import '../sass/ManageProjects.scss';
import EventsApiService_ from '../api/EventsApiService';
import { Typography, Box } from '@mui/material';

const PAGES = Object.freeze({
  selectProject: 'selectProject',
  editProjectInfo: 'editProjectInfo',
  editMeetingTimes: 'editMeetingTimes',
});

// Added styles for MUI components
const loadingStyle = {
  "display": "none",
  "position": "absolute",
  "display": "flex",
  "flexDirection": "row",
  "alignItems": "center",
  "justifyContent": "center",
  "zIndex": 1,
  "top": 0,
  "left": 0,
  "right": 0,
  "backgroundColor": "white",
  "height": '100%',
  "opacity": 0.6,
}

const noStyle = {
  "opacity": 0,
  "display": "none",
}

const ManageProjects = () => {
  const { projectId } = useParams();
  const { auth } = useAuth();
  const [projects, setProjects] = useState();
  const [projectToEdit, setProjectToEdit] = useState();
  const [recurringEvents, setRecurringEvents] = useState();
  const [regularEvents, setRegularEvents] = useState([]);
  const [componentToDisplay, setComponentToDisplay] = useState('');
  const [projectApiService] = useState(new ProjectApiService());
  const [recurringEventsApiService] = useState(new RecurringEventsApiService());
  const [EventsApiService] = useState(new EventsApiService_());
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);

  const user = auth?.user;

  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    const projectRes = await projectApiService.fetchProjects();
    setProjects(projectRes);
    setProjectsLoading(false);
  }, [projectApiService]);

  const fetchRegularEvents = useCallback(async () => {
    setEventsLoading(true);
    const eventsRes = await EventsApiService.fetchEvents();
    setRegularEvents(eventsRes);
    setEventsLoading(false);
  }, [EventsApiService]);

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

  const updateRegularEvent = useCallback(
    async (eventToUpdate, eventId) => {
      await EventsApiService.updateEvent(eventToUpdate, eventId);
      fetchRegularEvents();
    },
    [fetchRegularEvents, EventsApiService]
  );

  useEffect(() => {
    // Refresh project to edit, if projects have been refreshed
    if (projectId && projects) {
      setProjectToEdit(
        projects.find(
          // eslint-disable-next-line no-underscore-dangle
          (proj) => proj._id === projectId
        )
      );
      setComponentToDisplay(PAGES.editProjectInfo);
    }
  }, [projects, setProjectToEdit, projectId]);

  useEffect(() => {
    fetchProjects();
    fetchRecurringEvents();
    fetchRegularEvents();
  }, [fetchProjects, fetchRecurringEvents, fetchRegularEvents]);

  // If not logged in, redirect to login page
  if (!auth && !auth?.user) {
    return <Redirect to="/login" />;
  }

  let displayedComponent;

  switch (componentToDisplay) {
    case PAGES.editProjectInfo:
      displayedComponent = (
        <EditProject
          projectToEdit={projectToEdit}
          recurringEvents={recurringEvents}
          updateProject={updateProject}
          userAccessLevel={user.accessLevel}
          createNewRecurringEvent={createNewRecurringEvent}
          deleteRecurringEvent={deleteRecurringEvent}
          updateRecurringEvent={updateRecurringEvent}
          regularEvents={regularEvents}
          updateRegularEvent={updateRegularEvent}
        />
      );
      break;
    // We are not using the SelectProject component anymore. Will remove soon.
    default:
      displayedComponent = (
        <SelectProject
          accessLevel={user?.accessLevel}
          projects={projects}
          user={user}
        />
      );
      break;
  }
  return (
    <>
      <Typography
        sx={eventsLoading || projectsLoading ? loadingStyle : noStyle}
        component='span'
        display='inline'
      >
        <Box component='img' src={Loading} alt="Logo" />
      </Typography>
      {displayedComponent}
    </>
  );
};

export default ManageProjects;
