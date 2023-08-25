import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ProjectApiService from '../api/ProjectApiService';

import { ReactComponent as EditIcon } from '../svg/Icon_Edit.svg';
import { ReactComponent as PlusIcon } from '../svg/PlusIcon.svg';
import { Redirect } from 'react-router-dom';
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
import useAuth from '../hooks/useAuth';

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

/**
 * Takes Array, formData, projectToEdit, handleChage, isEdit
 * submitForm, handleChange, and isEdit are for the edit forms.
 * - formData - passes the current project information to the form.
 * - projectToEdit - used to grab the of the project we are editing.
 * - handleChange - changes the input values to whatever the user changes it to.
 * - Where its creating a new project or editing one - True or False.
 * */
export default function ProjectForm({
  arr,
  formData,
  projectToEdit,
  handleChange,
  isEdit,
  revertToOriginal,
  setOriginalProjectData,
}) {
  const history = useHistory();

  // ----------------- States -----------------
  const [locationType, setLocationType] = useState('remote');
  // State to track the toggling from Project view to Edit Project View via edit icon.
  const [editMode, setEditMode] = useState(false);
  const { auth } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      name: '',
      description: '',
      location: '',
      githubUrl: '',
      slackUrl: '',
      googleDriveUrl: '',
    },
  });

  // ----------------- Submit requests -----------------

  // Handles POST request found in api/ProjectApiService.
  const submitNewProject = async (data) => {
    const projectApi = new ProjectApiService();
    try {
      const id = await projectApi.create(data);
      history.push(`/projects/${id}`);
    } catch (errors) {
      console.error(errors);
      return;
    }
  };

  // Fires PUT request to update the project,
  const submitEditProject = async (data) => {
    const projectApi = new ProjectApiService();
    try {
      await projectApi.updateProject(projectToEdit._id, data);
    } catch (errors) {
      console.error(errors);
      return;
    }
    setOriginalProjectData(data);
    setEditMode(true);
  };

  // ----------------- Handles and Toggles -----------------

  // Handles the location radio button change.
  const handleRadioChange = (event) => {
    setLocationType(event.target.value);
  };
  // Toggles the project view to edit mode change.
  const handleEditMode = (event) => {
    setEditMode(!editMode);
    revertToOriginal();
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
        <EditIcon style={{ p: 1}} />
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
            disabled={!editMode}
          />
          <Box sx={{ width: '10px' }} />
          <StyledFormControlLabel
            value="in-person"
            control={<StyledRadio size="small" />}
            label="In-Person"
            disabled={!editMode}
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
      <Box sx={{ bgcolor: '#F5F5F5' }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>
              {editMode ? 'Editing Project' : 'Project Information'}
            </Typography>
          </Box>
          {isEdit ? editIcon() : addIcon()}
        </Box>
        <Divider sx={{ borderColor: 'rgba(0,0,0,1)' }} />
        <Box sx={{ py: 2, px: 4 }}>
          <form
            id="project-form"
            onSubmit={handleSubmit((data) => {
              isEdit ? submitEditProject(data) : submitNewProject(data);
            })}
          >
            {arr.map((input) => (
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
                  {input.name === 'location' && locationRadios}
                </Grid>
                {/* Sets text field and data (if needed) based on the whether it is as add or edit form page. */}
                {isEdit ? (
                  /**
                   * Edit textfield.
                   * Includes
                   * - handleChange - to update the input fields based on users input.
                   * - value - formData that is passed from the DB to fill the input fields.
                   * */
                  <TextField
                    error={!!errors[input.name]}
                    type={input.type}
                    {...register(input.name, {
                      required: `${input.name} is required`,
                      pattern:
                        input.name === 'location'
                          ? locationType === 'remote'
                            ? {
                                value: input.value,
                                message: input.errorMessage,
                              }
                            : {
                                value: input.addressValue,
                                message: input.addressError,
                              }
                          : { value: input.value, message: input.errorMessage },
                    })}
                    placeholder={input.placeholder}
                    helperText={`${errors[input.name]?.message || ' '}`}
                    onChange={handleChange}
                    value={formData[input.name]}
                    disabled={!editMode}
                  />
                ) : (
                  // Add new project textfield.
                  <TextField
                    error={!!errors[input.name]}
                    type={input.type}
                    {...register(input.name, {
                      required: `${input.name} is required`,
                      pattern:
                        input.name === 'location'
                          ? locationType === 'remote'
                            ? {
                                value: input.value,
                                message: input.errorMessage,
                              }
                            : {
                                value: input.addressValue,
                                message: input.addressError,
                              }
                          : { value: input.value, message: input.errorMessage },
                    })}
                    placeholder={input.placeholder}
                    helperText={`${errors[input.name]?.message || ' '}`}
                  />
                )}
              </Box>
            ))}
          </form>
        </Box>
      </Box>
      <Box>
        <Grid container justifyContent="space-evenly" sx={{ my: 3 }}>
          <Grid item xs="auto">
            <StyledButton
              type="submit"
              form="project-form"
              variant={editMode ? "contained" : "secondary"}
              cursor="pointer"
              disabled={!editMode}
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
    </Box>
  ) : (
    <Redirect to="/login" />
  );
}