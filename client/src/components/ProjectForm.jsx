import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm, useFormState } from 'react-hook-form';
import {
  CircularProgress,
  Typography,
  Box,
  Button,
  Grid,
  Radio,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Paper,
} from '@mui/material';

import useAuth from '../hooks/useAuth';
import ProjectApiService from '../api/ProjectApiService';
import EditIcon from '../svg/Icon_Edit.svg?react';
import PlusIcon from '../svg/PlusIcon.svg?react';
import ValidatedTextField from './parts/form/ValidatedTextField';
import TitledBox from './parts/boxes/TitledBox';
import ChangesModal from './ChangesModal';

/** STYLES
 *  -most TextField and InputLabel styles are controlled by the theme
 *  -a few repeated styles are parked here
 *  -the rest are inline
 */

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
  setFormData,
}) {
  const history = useHistory();

  // ----------------- States -----------------
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [locationType, setLocationType] = useState('remote');
  // State to track the toggling from Project view to Edit Project View via edit icon.
  const [editMode, setEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);
  const checkFields = () => {
    history.push('/projects');
  };

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
    control,
  } = useForm({
    mode: 'all',
    // Holds the current project data in state.
    defaultValues: {
      ...formData,
    },
  });

  const { dirtyFields } = useFormState({ control });

  // ----------------- Submit requests -----------------

  // Handles POST request found in api/ProjectApiService.
  const submitNewProject = async (data) => {
    const projectApi = new ProjectApiService();

    try {
      setIsLoading(true);
      const id = await projectApi.create(data);
      history.push(`/projects/${id}`);
    } catch (errors) {
      console.error(errors);
    }
    return () => setIsLoading(false);
  };

  // Fires PUT request to update the project,
  const submitEditProject = async (data) => {
    const projectApi = new ProjectApiService();
    try {
      setIsLoading(true);
      await projectApi.updateProject(projectToEdit._id, data);
    } catch (errors) {
      console.error(errors);
      setIsLoading(false);
      return;
    }
    // setOriginalProjectData(data);

    setIsLoading(false);
    setFormData(data);
    setEditMode(false);
  };

  // ----------------- Handles and Toggles -----------------

  // Handles the location radio button change.
  const handleRadioChange = (event) => {
    alert(event.target.value);
    setLocationType(event.target.value);
  };

  // Toggles the project view to edit mode change.
  const handleEditMode = () => {
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
        <EditIcon style={{ p: 1 }} />
        <Typography sx={{ p: 1, fontSize: '14px', fontWeight: '600' }}>
          {editMode ? 'Cancel' : 'Edit'}
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
          <FormControlLabel
            value="remote"
            control={<Radio size="small" />}
            label="Remote"
            disabled={isEdit ? !editMode : false}
          />
          <Box sx={{ width: '10px' }} />
          <FormControlLabel
            value="in-person"
            control={<Radio size="small" />}
            label="In-Person"
            disabled={isEdit ? !editMode : false}
          />
        </RadioGroup>
      </FormControl>
    </Grid>
  );

  const projectName = projectToEdit?.name || '[unnamed project]';
  return (
    <Box sx={{ px: 0.5 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h1">{projectName}</Typography>
      </Box>
      <Paper
        elevation={3}
        sx={{ padding: 3, borderRadius: 1, backgroundColor: '#f5f5f5' }}
      >
        {auth.user.accessLevel === 'admin' ||
        auth.user.accessLevel === 'superadmin' ? (
          <TitledBox
            title={editMode ? 'Editing Project' : 'Project Information'}
            badge={isEdit ? editIcon() : addIcon()}
            expandable={true}
          >
            <Box
              component="form"
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
              <ChangesModal
                open={isModalOpen}
                onClose={handleClose}
                destination={'/projects'}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                handleClose={handleClose}
              />
            </Box>
            <Grid container justifyContent="space-evenly" sx={{ my: 3 }}>
              <Grid item xs="auto">
                <Button
                  type="submit"
                  form="project-form"
                  variant={
                    !isEdit ? 'secondary' : !editMode ? 'contained' : 'secondary'
                  }
                  sx={{
                    width: '150px',
                    cursor: 'pointer',
                  }}
                  disabled={isEdit && isLoading ? !editMode : false}
                >
                  {isLoading ? <CircularProgress /> : 'Save'}
                </Button>
              </Grid>
              <Grid item xs="auto">
                <Button
                  variant="contained"
                  sx={{
                    width: '150px',
                    cursor: 'pointer',
                  }}
                  onClick={
                    !editMode || Object.keys(dirtyFields).length === 0
                      ? checkFields
                      : handleOpen
                  }
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          </TitledBox>
        ) : (
          <TitledBox title={'Project Information'} expandable={true}>
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
              <ChangesModal
                open={isModalOpen}
                onClose={handleClose}
                destination={'/projects'}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                handleClose={handleClose}
              />
            </form>
          </TitledBox>
        )}
      </Paper>
    </Box>
  );
}
