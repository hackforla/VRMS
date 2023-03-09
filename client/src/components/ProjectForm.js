import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

import {
  Typography,
  Box,
  Divider,
  TextField,
  InputLabel,
  Button,
} from '@mui/material';

/**
 *
 * TODO - Figure out how to bring in api call to create a new project
 *
 * */
export default function ProjectForm() {
  //   const navigate = useNavigate();
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

    try {
      console.log('hello world');
    } catch (errors) {
      setFormErrors(errors);
      return;
    }

    //navigate to the projects page after successful submission
    // navigate(`/projects`);
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

  console.log('FORM DATA', formData);

  return (
    <Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h1">Project Management</Typography>
      </Box>
      <Box sx={{ bgcolor: '#F5F5F5' }}>
        <Box sx={{ p: 2 }}>
          <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>
            Create New Project
          </Typography>
        </Box>
        <Divider sx={{ border: '1px solid black' }} />
        <Box sx={{ py: 2, px: 4 }}>
          <form onSubmit={handleSubmit}>
            {simpleInputs.map((input) => (
              <Box sx={{ mb: 3 }} key={input.name}>
                <InputLabel id={input.name}>{input.label}</InputLabel>
                <TextField
                  id={input.name}
                  name={input.name}
                  placeholder={input.placeholder}
                  variant="outlined"
                  type={input.type}
                  onChange={handleChange}
                  value={formData[input.name]}
                  {...(input.type === 'textarea' && {
                    multiline: true,
                    minRows: 3,
                  })}
                />
              </Box>
            ))}
            <Button
              type="submit"
              variant="contained"
              elevation={0}
              sx={{ mb: 1 }}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
