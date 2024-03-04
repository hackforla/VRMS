import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ProjectApiService from '../api/ProjectApiService';
import { ReactComponent as PlusIcon } from '../svg/PlusIcon.svg';
import { Redirect } from 'react-router-dom'
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
import useAuth from "../hooks/useAuth"
import TitledBox from './TitledBox';

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
    value: /^[a-zA-Z0-9].{0,250}$/,
    errorMessage: 'Description is too long, max 250 characters allowed'
  },
  {
    label: 'Location',
    name: 'location',
    type: 'text',
    placeholder: 'Enter location for meeting',
    value: /https:\/\/[\w-]*\.?zoom.us\/(j|my)\/[\d\w?=-]+/,
    errorMessage: 'Please enter a valid Zoom URL',
    addressValue: '',
    addressError: 'Invalid address'

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
    placeholder: 'htttps://github.com/'
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
  //seperate state for the location radio buttons
  const [locationType, setLocationType] = React.useState('remote');
  const [activeButton, setActiveButton] = React.useState('close');
  const [newlyCreatedID, setNewlyCreatedID] = useState(null);
  const history = useHistory();
  const { auth } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({ 
    mode: 'all',
    defaultValues: {
      name: '',
      description: '',
      location: '',
      githubUrl: '',
      slackUrl: '',
      googleDriveUrl: ''
    }
  });

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

  const submitForm = async (data) => {
    const projectApi = new ProjectApiService();
    try {
      const id = await projectApi.create(data);
      setNewlyCreatedID(id);
    } catch (errors) {
      console.error(errors);
      return;
    }
    setActiveButton('close');
  };

  // ----------------- Icons -----------------

  // Holds the Add New Project Icon and styling.
  const addIcon = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <PlusIcon style={{ p: 1 }} />
        <Typography sx={{ p: 1, fontSize: '14px', fontWeight: '600' }}>
          Add New Project
        </Typography>
      </Box>
    );
  };
  // Holds the Edit New Project Icon and styling.
  const editIcon = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={handleEditMode}
      >
        <EditIcon style={{ p: 1 }} />
        <Typography sx={{ p: 1, fontSize: '14px', fontWeight: '600' }}>
          {editMode ? 'Cancel' : 'Edit Mode'}
        </Typography>
      </Box>
    );
  };

  // ----------------- Location radio -----------------

  // Holdes the location radios styling.
  const locationRadios = (
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

  return auth && auth.user ? (
    <Box sx={{ px: 0.5 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h1">Project Management</Typography>
      </Box>
      <TitledBox
        title={editMode ? 'Editing Project' : 'Project Information'}
        badge={isEdit ? editIcon() : addIcon()}
      >
        <form
          id="project-form"
          onSubmit={handleSubmit((data) => {
            isEdit ? submitEditProject(data) : submitNewProject(data);
          })}
        >
          {arr.map((input) => (
            <ValidatedTextField
              key={input.name}
              register={register}
              isEdit={isEdit}
              editMode={editMode}
              locationType={locationType}
              locationRadios={locationRadios}
              errors={errors}
              input={input}
            />
          ))}
        </form>
        <Box>
          <Grid container justifyContent="space-evenly" sx={{ my: 3 }}>
            <Grid item xs="auto">
              <StyledButton
                type="submit"
                form="project-form"
                variant={!isEdit ? 'secondary' : !editMode ? 'contained' : 'secondary'}
                cursor="pointer"
                disabled={isEdit ? !editMode : false}
              >
                Save
              </StyledButton>
            </Grid>
            <Grid item xs="auto">
              <StyledButton
                component={Link}
                to="/projects"
                variant="contained"
                cursor="pointer"
              >
                Close
              </StyledButton>
            </Grid>
          </Grid>
        </Box>
      </TitledBox>
    </Box>
  ) : (
    <Redirect to="/login" />
  )
}
