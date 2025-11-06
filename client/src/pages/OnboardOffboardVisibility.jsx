import { useState, useEffect } from 'react';
import ProjectApiService from '../api/ProjectApiService';
import TitledBox from '../components/parts/boxes/TitledBox';
import {
  Box,
  CircularProgress,
  Typography,
  Switch,
  Tooltip,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

/**
 * On/Offboard Visibility Page
 *
 * Allows Admins and Super Admins to control whether the onboarding/offboarding
 * forms are visible on individual project pages.
 *
 * Only accessible to users with accessLevel 'admin' or 'superadmin'.
 */
export default function OnboardOffboardVisibility({ auth }) {
  const [projects, setProjects] = useState(null);
  const [projectApiService] = useState(new ProjectApiService());
  const [loading, setLoading] = useState(false);

  const user = auth?.user;

  // Fetch all projects on component mount
  useEffect(() => {
    async function fetchAllProjects() {
      try {
        const projectData = await projectApiService.fetchProjects();
        // Sort projects alphabetically
        const sortedProjects = projectData.sort((a, b) =>
          a.name?.localeCompare(b.name)
        );
        setProjects(sortedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }

    fetchAllProjects();
  }, [projectApiService]);

  // Handle toggle switch change
  const handleVisibilityToggle = async (projectId, currentValue) => {
    setLoading(true);
    try {
      await projectApiService.updateOnboardOffboardVisibility(
        projectId,
        !currentValue
      );

      // Update local state
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId
            ? { ...project, onboardOffboardVisible: !currentValue }
            : project
        )
      );
    } catch (error) {
      console.error('Error updating visibility:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while projects are being fetched
  if (!projects) {
    return (
      <Box sx={{ textAlign: 'center', pt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Only allow admin or superadmin access
  if (user?.accessLevel !== 'admin' && user?.accessLevel !== 'superadmin') {
    return (
      <Box sx={{ px: 1, py: 3 }}>
        <Typography variant="h2" textAlign="center" color="error">
          Access Denied
        </Typography>
        <Typography textAlign="center" sx={{ mt: 2 }}>
          You do not have permission to view this page.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 1, py: 2 }}>
      {/* Page Title */}
      <Box sx={{ my: 3 }}>
        <Typography variant="h1" textAlign="center">
          On / Offboard Visibility
        </Typography>
      </Box>

      {/* Projects Table in TitledBox */}
      <TitledBox
        title="Projects"
        badge={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: '150px',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              Visibility
            </Typography>
            <Tooltip
              title="This feature allows Admins and Super Admins to control whether the onboarding/offboarding forms are visible on project pages. Setting a project's visibility to 'No' hides these forms from all users on the associated project's project management page."
              arrow
              placement="left"
            >
              <InfoOutlinedIcon
                sx={{
                  fontSize: '20px',
                  color: '#666',
                  cursor: 'pointer',
                  '&:hover': { color: '#333' },
                }}
              />
            </Tooltip>
          </Box>
        }
        childrenBoxSx={{ p: 0 }}
      >
        {/* Project List */}
        <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {projects.map((project) => (
            <Box
              key={project._id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                px: 2,
                py: 1.5,
                borderBottom: '1px solid #e0e0e0',
                '&:hover': { backgroundColor: '#e8e8e8' },
              }}
            >
              <Typography
                sx={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}
              >
                {project.name}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  minWidth: '150px',
                }}
              >
                <Typography sx={{ fontSize: '14px', minWidth: '35px' }}>
                  {project.onboardOffboardVisible !== false ? 'Yes' : 'No'}
                </Typography>
                <Switch
                  checked={project.onboardOffboardVisible !== false}
                  onChange={() =>
                    handleVisibilityToggle(
                      project._id,
                      project.onboardOffboardVisible !== false
                    )
                  }
                  disabled={loading}
                  color="primary"
                />
              </Box>
            </Box>
          ))}
        </Box>
      </TitledBox>
    </Box>
  );
}
