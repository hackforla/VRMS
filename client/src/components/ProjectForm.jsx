import React, { useState } from 'react';
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
import ValidatedTextField from './parts/form/ValidatedTextField';

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


/**
 
/**
 * Takes Array, formData, projectToEdit, handleChage, isEdit
 * submitForm, handleChange, and isEdit are for the edit forms.
 * - arr - simpleInputs arr from the edit page that holds the input's properties.
 * - formData - passes the current project information to the form.
 * - projectToEdit - used to grab the of the project we are editing.
 * - isEdit - Whether its creating a new project or editing one - True or False.
 * - setFormData - allows us to updated the form data.
 * */
export default function ProjectForm({
  arr,
  formData,
  projectToEdit,
  isEdit,
  setFormData
}) {
  const history = useHistory();

  // ----------------- States -----------------
  const [locationType, setLocationType] = useState('remote');
  // State to track the toggling from Project view to Edit Project View via edit icon.
  const [editMode, setEditMode] = useState(false);
  const { auth } = useAuth();

  /**
   * React Hook Forms
   *  - register
   *  - handleSubmit
   *  - formState
   *  - reset
   *  - defaultValues - holds edit project data
   *
   */

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'all',
    // Holds the current project data in state.
    defaultValues: {
      ...formData,
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
    // setOriginalProjectData(data);
    setFormData(data);
    setEditMode(false);
  };

  // ----------------- Handles and Toggles -----------------

  // Handles the location radio button change.
  const handleRadioChange = (event) => {
    setLocationType(event.target.value);
  };

  // Toggles the project view to edit mode change.
  const handleEditMode = (event) => {
    setEditMode(!editMode);
    // React hook form method to reset data back to original values. Triggered when Edit Mode is cancelled.
    reset({
      ...formData,
    });
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
            disabled={isEdit ? !editMode : false}
          />
          <Box sx={{ width: '10px' }} />
          <StyledFormControlLabel
            value="in-person"
            control={<StyledRadio size="small" />}
            label="In-Person"
            disabled={isEdit ? !editMode : false}
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
        </Box>
      </Box>
    </Box>
  ) : (
    <Redirect to="/login" />
  );
}
