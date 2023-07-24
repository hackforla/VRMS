import React, { useState, useEffect, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import '../sass/UserAdmin.scss';
import useAuth from '../hooks/useAuth';
import EditUsers from '../components/user-admin/EditUsers';
import UserManagement from '../components/user-admin/UserManagement';
import UserApiService from '../api/UserApiService';
import ProjectApiService from '../api/ProjectApiService';

const UserAdmin = () => {
  // Initialize state hooks
  const { auth } = useAuth();
  const [users, setUsers] = useState([]); // All users pulled from database
  const [projects, setProjects] = useState([]); // All projects pulled from db
  const [userToEdit, setUserToEdit] = useState({}); // The selected user that is being edited

  const [userApiService] = useState(new UserApiService());
  const [projectApiService] = useState(new ProjectApiService());

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
    async(user, isActive) => {
      await userApiService.updateUserDbIsActive(user, isActive);
      fetchUsers()
    }, [userApiService, fetchUsers]
  )

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
    return <UserManagement users={users} setUserToEdit={setUserToEdit} />;
  } else {
    return (
      <EditUsers
        userToEdit={userToEdit}
        projects={projects}
        updateUserDb={updateUserDb}
        backToSearch={backToSearch}
        updateUserActiveStatus={updateUserActiveStatus}
      />
    );
  }
};

export default UserAdmin;
