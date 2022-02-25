import React, { useState, useEffect, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import SelectProject from '../components/manageProjects/selectProject';
import EditMeetingTimes from '../components/manageProjects/editMeetingTimes';
import EditProject from '../components/manageProjects/editProject';
import ProjectApiService from '../api/ProjectApiService';
import RecurringEventsApiService from '../api/RecurringEventsApiService';
import '../sass/ManageProjects.scss';

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

  const user = auth?.user;

  const fetchProjects = useCallback(async () => {
    const projectRes = await projectApiService.fetchProjects();
    setProjects(projectRes);
  }, [projectApiService]);

  const fetchRecurringEvents = useCallback(async () => {
    const eventsRes = await recurringEventsApiService.fetchRecurringEvents();
    setRecurringEvents(eventsRes);
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

  const meetingSelectClickHandler = () => {
    setComponentToDisplay(PAGES.editMeetingTimes);
  };

  const setEditProject = () => {
    setComponentToDisplay(PAGES.editProjectInfo);
  };

  const goSelectProject = () => {
    setProjectToEdit([]);
    setComponentToDisplay(PAGES.selectProject);
  };
  // }

  switch (componentToDisplay) {
    case PAGES.editMeetingTimes:
      return (
        <EditMeetingTimes
          goSelectProject={goSelectProject}
          goEditProject={setEditProject}
          projectToEdit={projectToEdit}
          recurringEvents={recurringEvents}
        />
      );
    case PAGES.editProjectInfo:
      return (
        <EditProject
          projectToEdit={projectToEdit}
          goSelectProject={goSelectProject}
          recurringEvents={recurringEvents}
          updateProject={updateProject}
          meetingSelectClickHandler={meetingSelectClickHandler}
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
