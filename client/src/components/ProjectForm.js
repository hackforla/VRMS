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

import useAuth from '../hooks/useAuth';
import ProjectApiService from '../api/ProjectApiService';
import { ReactComponent as EditIcon } from '../svg/Icon_Edit.svg';
import { ReactComponent as PlusIcon } from '../svg/PlusIcon.svg';
import ValidatedTextField from './parts/form/ValidatedTextField';
import TitledBox from './parts/boxes/TitledBox';
import ChangesModal from './ChangesModal';

/** STYLES
 *  -most TextField and InputLabel styles are controlled by the theme
 *  -a few repeated styles are parked here
 *  -the rest are inline
 */

export const StyledButton = styled(Button)(({ theme }) => ({
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpen = () => setIsModalOpen(true)
  const handleClose = () => setIsModalOpen(false)

  const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
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
  } = useForm({
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
       <ChangesModal 
        open={isModalOpen} 
        onClose={handleClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description" 
        handleClose={handleClose}
        />
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
                variant="contained"
                cursor="pointer"
                onClick={handleOpen}
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
