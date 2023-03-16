import React, { useState, useEffect } from 'react';
import ProjectApiService from '../api/ProjectApiService';
import { Box, CircularProgress, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

export default function ProjectList() {
  const [projects, setProjects] = useState(null);
  const [projectApiService] = useState(new ProjectApiService());

  /* On component mount, load projects from API */
  useEffect(function getProjectsOnMount() {
    console.debug('ProjectList useEffect getProjectsOnMount');

    async function fetchAllProjects() {
      const projects = await projectApiService.fetchProjects();
      setProjects(projects);
    }

    fetchAllProjects();
  }, []);

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
      <Typography variant="h1" textAlign="center">
        Project Management
      </Typography>
      <p>Here is a list of all projects:</p>
      <Box sx={{ bgcolor: 'grey.100' }}>
        {projects.map((project) => (
          <li key={project._id}>
            <Link to={`/projects/${project._id}`}>{project.name}</Link>
          </li>
        ))}
      </Box>
    </Box>
  );
}
