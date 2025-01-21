import React, { useState, useEffect, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import '../sass/UserAdmin.scss';
import useAuth from '../hooks/useAuth';
import EditUsers from '../components/user-admin/EditUsers';
import UserPermissionSearch from '../components/user-admin/UserPermissionSearch';
import UserApiService from '../api/UserApiService';
import ProjectApiService from '../api/ProjectApiService';

//NOTE: This page is based off of "UserAdmin.jsx" for now. It should be update as part of #1801.

const UserPermission = () => {
  // Initialize state hooks
  const { auth } = useAuth();
  const [users, setUsers] = useState([]); // All users pulled from database
  const [projects, setProjects] = useState([]); // All projects pulled from db
  const [userToEdit, setUserToEdit] = useState({}); // The selected user that is being edited

  const [userApiService] = useState(new UserApiService());
  const [projectApiService] = useState(new ProjectApiService());

  // NOTE: will have to be updated as part of #1801
  const fetchUsers = useCallback(async () => {
    const userRes = await userApiService.fetchUsers();
    setUsers(userRes);
  }, [userApiService]);

  const updateUserDb = useCallback(
    async (user, managedProjects) => {
      await userApiService.updateUserDbProjects(user, managedProjects);
      fetchUsers();
    },
    [userApiService, fetchUsers]
  );

  const updateUserActiveStatus = useCallback(
    async (user, isActive) => {
      await userApiService.updateUserDbIsActive(user, isActive);
      fetchUsers();
    },
    [userApiService, fetchUsers]
  );

  // Update user's access level (admin/user)
  const updateUserAccessLevel = useCallback(
    async (user, newAccessLevel) => {
      await userApiService.updateUserAccessLevel(user, newAccessLevel);
      fetchUsers();
    },
    [userApiService, fetchUsers]
  );

  const fetchProjects = useCallback(async () => {
    const projectRes = await projectApiService.fetchProjects();
    setProjects(projectRes);
  }, [projectApiService]);

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, [fetchUsers, fetchProjects]);

  const backToSearch = () => {
    setUserToEdit({});
  };

  if (!auth && !auth?.user) {
    return <Redirect to="/login" />;
  }

  if (Object.keys(userToEdit).length === 0) {
    return <UserPermissionSearch users={users} setUserToEdit={setUserToEdit} />;
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
