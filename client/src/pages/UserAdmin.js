import React, { useState, useEffect, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import '../sass/UserAdmin.scss';
import useAuth from '../hooks/useAuth';
import AddNewProject from '../components/user-admin/AddNewProject';
import EditUsers from '../components/user-admin/EditUsers';
import UserManagement from '../components/user-admin/UserManagement';
import UserApiService from '../api/UserApiService';
import ProjectApiService from '../api/ProjectApiService';

const PAGES = Object.freeze({
  main: 'main',
  addNewProject: 'addNewProject',
  userManagement: 'userManagement',
});

// Parent
const UserAdmin = () => {
  // Initialize state hooks
  const { auth } = useAuth();
  const [users, setUsers] = useState([]); // All users pulled from database
  const [projects, setProjects] = useState([]); // All projects pulled from db
  const [userToEdit, setUserToEdit] = useState({}); // The selected user that is being edited
  const [currentPage, setCurrentPage] = useState(PAGES.userManagement);

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

  const fetchProjects = useCallback(async () => {
    const projectRes = await projectApiService.fetchProjects();
    setProjects(projectRes);
  }, [projectApiService]);

  const handleNewProjectFormSubmit = useCallback(
    async (projectName) => {
      await projectApiService.addProjectToDb(projectName);
      fetchProjects();
    },
    [projectApiService, fetchProjects]
  );

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, [fetchUsers, fetchProjects]);

  // Handle cancel form and return to search
  const handleProjectFormCancel = () => {
    setCurrentPage(PAGES.main);
    setUserToEdit({});
  };

  const backToSearch = () => {
    setUserToEdit({});
  };

  if (!auth && !auth?.user) {
    return <Redirect to="/login" />;
  }

  if (currentPage === PAGES.userManagement) {
    if (Object.keys(userToEdit).length === 0) {
      return (
        <UserManagement
          users={users}
          setUserToEdit={setUserToEdit}
          handleProjectFormCancel={handleProjectFormCancel}
        />
      );
    }
    return (
      <EditUsers
        userToEdit={userToEdit}
        projects={projects}
        updateUserDb={updateUserDb}
        handleFormCancel={handleProjectFormCancel}
        backToSearch={backToSearch}
      />
    );
  }

  if (currentPage === PAGES.addNewProject) {
    return (
      <AddNewProject
        onBackClick={() => setCurrentPage(PAGES.main)}
        handleNewProjectFormSubmit={handleNewProjectFormSubmit}
        projects={projects}
      />
    );
  }

  return (
    <div>
      <div>
        <button
          type="button"
          className="button"
          onClick={() => setCurrentPage(PAGES.userManagement)}
        >
          User Management
        </button>
      </div>
      <div>
        <button
          type="button"
          className="button"
          onClick={() => setCurrentPage(PAGES.addNewProject)}
        >
          Add New Project
        </button>
      </div>
    </div>
  );
};

export default UserAdmin;
