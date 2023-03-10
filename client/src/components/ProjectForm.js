import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ProjectApiService from '../api/ProjectApiService';

import {
  Typography,
  Box,
  Divider,
  TextField,
  InputLabel,
  Button,
  Grid,
} from '@mui/material';

/** Project Form Component
 *
 * To be used for creating and updating a project
 * */

export default function ProjectForm() {
  let history = useHistory();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    githubIdentifier: '',
    githubUrl: '',
    slackUrl: '',
    googleDriveUrl: '',
    hflaWebsiteUrl: '',
  });

  const [formErrors, setFormErrors] = useState([]);

  //update state of formData onChange of any form input field
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
    setFormErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectApi = new ProjectApiService();

    try {
      console.log('FORM DATA', formData);
      console.log('PROJECT API SERVICE', projectApi.create);
      const response = await projectApi.create(formData);
      console.log('RESPONSE', response);
    } catch (errors) {
      setFormErrors(errors);
      return;
    }

    //For now, navigate to projects page after successful form submission
    //TODO - Figure out how to navigate to newly created project details page
    history.push('/projects');
  };

  /** All TextField and InputLabel styles are controlled by the theme */

  const simpleInputs = [
    {
      label: 'Project Name',
      name: 'name',
      type: 'text',
      placeholder: 'Enter project name',
    },
    {
      label: 'Project Description',
      name: 'description',
      type: 'textarea',
      placeholder: 'Enter project description',
    },
    {
      label: 'Location',
      name: 'location',
      type: 'text',
      placeholder: 'Enter project location',
    },
    {
      label: 'GitHub Identifier',
      name: 'githubIdentifier',
      type: 'text',
      placeholder: 'Enter GitHub identifier',
    },
    {
      label: 'GitHub URL',
      name: 'githubUrl',
      type: 'text',
      placeholder: 'htttps://github.com/',
    },
    {
      label: 'Slack URL',
      name: 'slackUrl',
      type: 'text',
      placeholder: 'htttps://slack.com/',
    },
    {
      label: 'Google Drive URL',
      name: 'googleDriveUrl',
      type: 'text',
      placeholder: 'htttps://drive.google.com/',
    },
    {
      label: 'HFLA Website URL',
      name: 'hflaWebsiteUrl',
      type: 'text',
      placeholder: 'htttps://hackforla.org/projects/',
    },
  ];

  return (
    <Box sx={{ px: 0.5 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h1">Project Management</Typography>
      </Box>
      <Box sx={{ bgcolor: '#F5F5F5' }}>
        <Box sx={{ p: 2 }}>
          <Typography sx={{ fontSize: '18px' }}>Project Information</Typography>
        </Box>
        <Divider />
        <Box sx={{ py: 2, px: 4 }}>
          <form id="project-form" onSubmit={handleSubmit}>
            {simpleInputs.map((input) => (
              <Box sx={{ mb: 1 }} key={input.name}>
                <InputLabel id={input.name}>{input.label}</InputLabel>
                <TextField
                  id={input.name}
                  name={input.name}
                  placeholder={input.placeholder}
                  variant="outlined"
                  type={input.type}
                  onChange={handleChange}
                  helperText=" "
                  value={formData[input.name]}
                  {...(input.type === 'textarea' && {
                    multiline: true,
                    minRows: 3,
                  })}
                />
              </Box>
            ))}
          </form>
        </Box>
      </Box>
      <Box>
        <Grid container spacing={4} sx={{ px: 3, my: 1 }}>
          <Grid item xs={6}>
            <Button
              type="submit"
              form="project-form"
              variant="contained"
              sx={{ mb: 1 }}
            >
              Save
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="secondary" sx={{ mb: 1 }}>
              Close
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
