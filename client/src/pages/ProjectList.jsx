import { useState, useEffect } from 'react';
import ProjectApiService from '../api/ProjectApiService';
import { styled } from '@mui/system';

import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import TitledBox from '../components/parts/boxes/TitledBox';

import useAuth from '../hooks/useAuth';
import { ROLES } from '../../../shared/roles';

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
  const { auth, hasMinimumRole, hasAnyRole } = useAuth();
  const [projects, setProjects] = useState(null);
  const [projectApiService] = useState(new ProjectApiService());

  const user = auth?.user;

  // On component mount, request projects data from API
  useEffect(
    function getProjectsOnMount() {
      async function fetchAllProjects() {
        let projectData;

        if (hasMinimumRole(ROLES.ADMIN)) {
          projectData = await projectApiService.fetchProjects();
        } else if (user?.managedProjects?.length > 0) {
          // if user is not admin, but is a project manager, only show projects they manage
          projectData = await projectApiService.fetchPMProjects(
            user.managedProjects,
          );
        }

        //sort the projects alphabetically
        projectData = projectData.sort((a, b) => a.name?.localeCompare(b.name));

        setProjects(projectData);
      }

      fetchAllProjects();
    },
    [projectApiService, user.accessLevel, user.managedProjects],
  );

  const projsWithUsers = projects?.filter(
    (project) => project.managedByUsers?.length > 0,
  );
  console.log('Projects with users:', projsWithUsers);

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

      {hasAnyRole(ROLES.ADMIN, ROLES.SUPER_ADMIN) && (
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
            <StyledTypography component={Link} to={`/projects/${project._id}`}>
              {project.name}
            </StyledTypography>
          </Box>
        ))}
      </TitledBox>
    </Box>
  );
}
