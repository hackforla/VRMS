import React, { useState, useEffect, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import '../sass/UserAdmin.scss';
import useAuth from '../hooks/useAuth';
import EditUsers from '../components/user-admin/EditUsers';
import UserPermissionSearch from '../components/user-admin/UserPermissionSearch';
import UserApiService from '../api/UserApiService';
import ProjectApiService from '../api/ProjectApiService';

const UserPermission = () => {
  // Initialize state hooks
  const { auth } = useAuth();
  const [admins, setAdmins] = useState([]); // All admins pulled from database
  const [projects, setProjects] = useState([]); // All projects pulled from db
  const [projectManagers, setProjectManagers] = useState([]); //All project managers pulled from db
  const [userToEdit, setUserToEdit] = useState({}); // The selected user that is being edited

  const [userApiService] = useState(new UserApiService());
  const [projectApiService] = useState(new ProjectApiService());

  const fetchAdmins = useCallback(async () => {
    const userRes = await userApiService.fetchAdmins();
    console.log('admin_list', userRes);
    setAdmins(userRes);
  }, [userApiService]);

  const fetchProjectsManagers = useCallback(async () => {
    const pmRes = await userApiService.fetchProjectsManagers();
    console.log('projectLead_list', pmRes);
    setProjectManagers(pmRes);
  }, [userApiService]);

  const updateUserDb = useCallback(
    async (user, managedProjects) => {
      await userApiService.updateUserDbProjects(user, managedProjects);
      fetchAdmins();
    },
    [userApiService, fetchAdmins]
  );

  const updateUserActiveStatus = useCallback(
    async (user, isActive) => {
      await userApiService.updateUserDbIsActive(admins, isActive);
      fetchAdmins();
    },
    [userApiService, fetchAdmins]
  );

  // Update user's access level (admin/user)
  const updateUserAccessLevel = useCallback(
    async (admin, newAccessLevel) => {
      await userApiService.updateUserAccessLevel(admin, newAccessLevel);
      fetchAdmins();
    },
    [userApiService, fetchAdmins]
  );

  const fetchProjects = useCallback(async () => {
    const projectRes = await projectApiService.fetchProjects();
    setProjects(projectRes);
  }, [projectApiService]);

  useEffect(() => {
    fetchAdmins();
    fetchProjects();
    fetchProjectsManagers();
  }, [fetchAdmins, fetchProjects, fetchProjectsManagers]);

  const backToSearch = () => {
    setUserToEdit({});
  };

  if (!auth && !auth?.user) {
    return <Redirect to="/login" />;
  }

  if (Object.keys(userToEdit).length === 0) {
    return (
      <UserPermissionSearch
        admins={admins}
        projectLeads={projectManagers}
        setUserToEdit={setUserToEdit}
      />
    );
  } else {
    return (
      <EditUsers
        userToEdit={userToEdit}
        projects={projects}
        updateUserDb={updateUserDb}
        backToSearch={backToSearch}
        updateUserActiveStatus={updateUserActiveStatus}
        updateUserAccessLevel={updateUserAccessLevel}
      />
    );
  }
};

export default UserPermission;
