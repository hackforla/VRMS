import React, { useState, useEffect } from 'react';
import ProjectApiService from '../api/ProjectApiService';
import {
  Box,
  CircularProgress,
  Typography,
  Divider,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';

export default function ProjectList() {
  const [projects, setProjects] = useState(null);
  const [projectApiService] = useState(new ProjectApiService());

  /* On component mount, request projects data from API */
  useEffect(
    function getProjectsOnMount() {
      async function fetchAllProjects() {
        let projectsData = await projectApiService.fetchProjects();
        //sort the projects alphabetically on front end for now but maybe we can do this on the backend db query
        projectsData = projectsData.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setProjects(projectsData);
      }

      fetchAllProjects();
    },
    [projectApiService]
  );

  /* Render loading circle until project data is served from API */
  if (!projects)
    return (
      <Box sx={{ textAlign: 'center', pt: 10 }}>
        <CircularProgress />
      </Box>
    );

  console.log(projects);

  return (
    <Box sx={{ px: 1 }}>
      <Box sx={{ my: 3 }}>
        <Typography variant="h1" textAlign="center">
          Project Management
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Button
          component={Link}
          to="/projects/create"
          variant="secondary"
          sx={{ mb: 3 }}
        >
          Add a New Project
        </Button>
      </Box>

      <Box sx={{ bgcolor: '#F5F5F5' }}>
        <Box sx={{ p: 2 }}>
          <Typography sx={{ fontFamily: 'Source Sans Pro', fontWeight: 600 }}>
            Active Projects
          </Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(0,0,0,1)' }} />
        <Box sx={{ p: 2 }}>
          {projects.map((project) => (
            <Box key={project._id} sx={{ mb: 0.5 }}>
              <Typography
                sx={{
                  fontFamily: 'Source Sans Pro',
                  textTransform: 'uppercase',
                }}
                component={Link}
                to={`/projects/${project._id}`}
              >
                {project.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
