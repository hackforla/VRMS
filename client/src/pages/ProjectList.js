import React, { useState, useEffect } from 'react';
import ProjectApiService from '../api/ProjectApiService';
import { styled } from '@mui/system';
import useAuth from '../hooks/useAuth';
import { Redirect } from 'react-router-dom';

import {
  Box,
  CircularProgress,
  Typography,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import TitledBox from '../components/parts/boxes/TitledBox';

const StyledTypography = styled(Typography)({
  textTransform: 'uppercase',
  color: '#1132F4',
  '&:hover': { fontWeight: '600' },
});

/** Project List Page
 *
 * Admin users can
 *  - see all projects in database
 *  - see button to add a new project
 *
 * Project managers can
 *   - see all projects they manage
 *   - will not see button to add a new project
 */

export default function ProjectList() {
  const [projects, setProjects] = useState(null);
  const [projectApiService] = useState(new ProjectApiService());

  // destructuring auth from context object created by AuthContext.Provider
  const { auth } = useAuth();
  const user = auth?.user;

  // On component mount, request projects data from API
  useEffect(
    function getProjectsOnMount() {
      async function fetchAllProjects() {
        let projectsData = await projectApiService.fetchProjects();

        //sort the projects alphabetically
        projectsData = projectsData.sort((a, b) =>
          a.name?.localeCompare(b.name)
        );

        // if user is not admin, but is a project manager, only show projects they manage
        if (user?.accessLevel !== 'admin' && user?.managedProjects.length > 0) {
          projectsData = projectsData.filter((project) =>
            user.managedProjects.includes(project._id)
          );
        }

        setProjects(projectsData);
      }

      fetchAllProjects();
    },
    [projectApiService, user.accessLevel, user.managedProjects]
  );

  // Figure out better way to block unauthorized users from accessing this page
  if (!auth) {
    return <Redirect to="/login" />;
  }

  // Render loading circle until project data is served from API
  if (!projects)
    return (
      <Box sx={{ textAlign: 'center', pt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ px: 1 }}>
      <Box sx={{ my: 3 }}>
        <Typography variant="h1" textAlign="center">
          Project Management
        </Typography>
      </Box>

      {user?.accessLevel === 'admin' && (
        <Box sx={{ textAlign: 'center' }}>
          <Button
            component={Link}
            to="/projects/create"
            variant="secondary"
            sx={{ mb: 3, px: 4 }}
          >
            Add a New Project
          </Button>
        </Box>
      )}

      <TitledBox title="Active Projects" childrenBoxSx={{ p: 2 }}>
          {projects.map((project) => (
            <Box key={project._id} sx={{ mb: 0.35 }}>
              <StyledTypography
                component={Link}
                to={`/projects/${project._id}`}
              >
                {project.name}
              </StyledTypography>
            </Box>
          ))}
      </TitledBox>
    </Box>
  );
}
