import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import ProjectApiService from '../api/ProjectApiService';
import { ReactComponent as PlusIcon } from '../svg/PlusIcon.svg';
import { Input } from './Input';

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
  // Leaving incase we want to add this back in for updating projects
  // {
  //   label: 'GitHub Identifier',
  //   name: 'githubIdentifier',
  //   type: 'text',
  //   placeholder: 'Enter GitHub identifier',
  // },
  {
    label: 'GitHub URL',
    name: 'githubUrl',
    type: 'text',
    placeholder: 'htttps://github.com/',
  },
  {
    label: 'Slack Channel Link',
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
  // Leaving incase we want to add this back in for updating projects
  // {
  //   label: 'HFLA Website URL',
  //   name: 'hflaWebsiteUrl',
  //   type: 'text',
  //   placeholder: 'htttps://hackforla.org/projects/',
  // },
];

/** STYLES
 *  -most TextField and InputLabel styles are controlled by the theme
 *  -a few repeated styles are parked here
 *  -the rest are inline
 */

const StyledButton = styled(Button)(({ theme }) => ({
  width: '150px',
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  width: 'max-content',
  '& .MuiFormControlLabel-label': {
    fontSize: '14px',
  },
}));

const StyledRadio = styled(Radio)(({ theme }) => ({
  padding: '0px 0px 0px 0px',
  marginRight: '.5rem',
}));

/**Project Form Component
 * -renders a form for creating and updating a project
 */

export default function ProjectForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    // githubIdentifier: '',
    githubUrl: '',
    slackUrl: '',
    googleDriveUrl: '',
    // hflaWebsiteUrl: '',
  });

  //seperate state for the location radio buttons
  const [locationType, setLocationType] = React.useState('remote');

  const [activeButton, setActiveButton] = React.useState('close');

  const [newlyCreatedID, setNewlyCreatedID] = useState(null);

  const history = useHistory();
  const methods = useForm();

  const routeToNewProjectPage = () => {
     if(newlyCreatedID !== null) {
      history.push(`/projects/${newlyCreatedID}`)
    }
  }
  
  useEffect(() => {
    routeToNewProjectPage()
  },[newlyCreatedID])

  // only handles radio button change
  const handleRadioChange = (event) => {
    setLocationType(event.target.value);
  };

  //updates state of formData onChange of any form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
  };

  const formSubmit = methods.handleSubmit(data => console.log("submitting", data))

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectApi = new ProjectApiService();
    try {
      const id = await projectApi.create(formData);
      setNewlyCreatedID(id);
    } catch (errors) {
      console.error(errors);
      return;
    }
    setActiveButton('close');
  };

  // Basic validation : if all inputs have values, enable the submit button
  useEffect(() => {
    if (Object.values(formData).every((val) => val !== '')) {
      setActiveButton('save');
    } else {
      setActiveButton('close');
    }
  }, [formData]);

  const LocationRadios = () => (
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
            control={<StyledRadio size="small" />}
            label="Remote"
          />
          <Box sx={{ width: '10px' }} />
          <StyledFormControlLabel
            value="in-person"
            control={<StyledRadio size="small" />}
            label="In-Person"
          />
        </RadioGroup>
      </FormControl>
    </Grid>
  );

  return (
    <FormProvider {...methods}>
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
              <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
                Add New Project
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ borderColor: 'rgba(0,0,0,1)' }} />
          <Box sx={{ py: 2, px: 4 }}>
            <form id="project-form" onSubmit={e => e.preventDefault()} noValidate>
              <Input
                label="project name"
                name="name"
                type="text"
                id="name"
                placeholder="Enter project name." 
                validation={{
                  required: {
                    value: true,
                    message: 'Project name Required'
                  }
                }}
                />

                <Input 
                  multiline
                  label="project description"
                  name="description"
                  type="text"
                  id="description"
                  placeholder="Enter a project description."
                  validation={{
                  required: {
                    value: true,
                    message: 'Description Required'
                  }
                }}
                  />

                  <LocationRadios />
                  {locationType === 'remote' ? (
                     <Input 
                  label="location"
                  name="location"
                  type="text"
                  id="location"
                  placeholder="Enter a Zoom link."
                  validation={{
                    required: {
                      value: true,
                      message: 'Zoom URL Required!'
                    },
                    pattern: {
                      value: /https:\/\/[\w-]*\.?zoom.us\/(j|my)\/[\d\w?=-]+/,
                      message: "Zoom URL is not valid"
    }
                  }}
                />
                  ) : (
                    <Input
                      label="address"
                      name="address"
                      id="address"
                      type="text"
                      placeholder="Enter the address."
                      validation={{
                        required: {
                          value: true,
                          message: "Address Required"
                        }
                      }}
                    />
                  ) }

                  <Input 
                    label='GitHub URL'
                    name='GitHub URL'
                    type= 'text'
                    id="githubUrl"
                    placeholder='https://github.com/'
                    validation={{
                      required: {
                        value: true,
                        message: "Github URL Required"
                      }
                    }}
                  />
                  <Input 
                    label='Slack channel link'
                    name='Slack channel link'
                    type= 'text'
                    id="slack"
                    placeholder='https://slack.com/'
                    validation={{
                      required: {
                        value: true,
                        message: "Slack URL Required"
                      }
                    }}
                  />

                  <Input 
                    label="Google Drive URL"
                    name="Google Drive URL"
                    type="text"
                    id="google"
                    placeholder="https://drive.google.com"
                    validation={{
                      required: {
                        value: true,
                        message: "Google Drive Required"
                      }
                    }}
                  />
               
            </form>
          </Box>
        </Box>
        <Box>
          <Grid container justifyContent="space-evenly" sx={{ my: 3 }}>
            <Grid item xs="auto">
              <StyledButton
                type="submit"
                form="project-form"
                // variant={activeButton === 'save' ? 'contained' : 'secondary'}
                // disabled={activeButton !== 'save'}
                onClick={formSubmit}
              >
                Save
              </StyledButton>
            </Grid>
            <Grid item xs="auto">
              <StyledButton
                component={Link}
                to="/projects"
                variant={activeButton === 'close' ? 'contained' : 'secondary'}
                disabled={activeButton !== 'close'}
              >
                Close
              </StyledButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </FormProvider>
  );
}
