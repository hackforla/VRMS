import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ProjectApiService from '../api/ProjectApiService';
import { ReactComponent as PlusIcon } from '../svg/PlusIcon.svg';

import {
  Typography,
  Box,
  Divider,
  TextField,
  InputLabel,
  Button,
  Grid,
  Radio,
  FormControl,
  FormControlLabel,
  RadioGroup,
} from '@mui/material';

import { styled } from '@mui/material/styles';

/** Project Form Component
 *
 * To be used for creating and updating a project
 * */

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

/** Keep some styles here to make return jsx more readable */
const StyledButton = styled(Button)(({ theme }) => ({
  width: '150px',
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  width: 'max-content',
  '& .MuiFormControlLabel-label': {
    fontSize: '14px',
  },
}));

export default function ProjectForm() {
  let history = useHistory();

  const [locationType, setLocationType] = React.useState('remote');

  const handleRadioChange = (event) => {
    setLocationType(event.target.value);
  };
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
      const response = await projectApi.create(formData);
      console.log('RESPONSE', response);
    } catch (errors) {
      setFormErrors(errors);
      return;
    }

    //For now, navigate to projects page after successful form submission
    history.push('/projects');
  };

  /** All TextField and InputLabel styles are controlled by the theme */

  console.log('FORM DATA', formData);
  return (
    <Box sx={{ px: 0.5 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h1">Project Management</Typography>
      </Box>
      <Box sx={{ bgcolor: '#F5F5F5' }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>
              Project Information
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <PlusIcon style={{ marginRight: '7px' }} />
            <Typography sx={{ fontSize: '14px' }}>Add New Project</Typography>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ py: 2, px: 4 }}>
          <form id="project-form" onSubmit={handleSubmit}>
            {simpleInputs.map((input) => (
              <Box sx={{ mb: 1 }} key={input.name}>
                <Grid container alignItems="center">
                  <Grid item xs="auto" sx={{ pr: 3 }}>
                    <InputLabel
                      sx={{ width: 'max-content', ml: 0.5, mb: 0.5 }}
                      id={input.name}
                    >
                      {input.label}
                    </InputLabel>
                  </Grid>

                  {input.name === 'location' && (
                    <Grid item>
                      <FormControl>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          value={locationType}
                          onChange={handleRadioChange}
                          sx={{ mb: 0.5 }}
                        >
                          <StyledFormControlLabel
                            value="remote"
                            control={
                              <Radio size="small" sx={{ p: 0, mr: 1 }} />
                            }
                            label="Remote"
                          />
                          <Box sx={{ width: '10px' }} />
                          <StyledFormControlLabel
                            value="in-person"
                            control={
                              <Radio size="small" sx={{ p: 0, mr: 1 }} />
                            }
                            label="In-Person"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  )}
                </Grid>

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
                    sx: {
                      '& .MuiInputBase-root': {
                        px: '4px',
                        py: '5px',
                      },
                    },
                  })}
                />
              </Box>
            ))}
          </form>
        </Box>
      </Box>
      <Box>
        <Grid container justifyContent="space-evenly" sx={{ my: 3 }}>
          <Grid item xs="auto">
            <StyledButton type="submit" form="project-form" variant="contained">
              Save
            </StyledButton>
          </Grid>
          <Grid item xs="auto">
            <StyledButton variant="secondary">Close</StyledButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
