import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EditMeetingTimes from './editMeetingTimes';
import CreateNewEvent from './createNewEvent';
import readableEvent from './utilities/readableEvent';
import ProjectApiService from '../../api/ProjectApiService';

import { ReactComponent as EditIcon } from '../../svg/Icon_Edit.svg';
import { ReactComponent as PlusIcon } from '../../svg/PlusIcon.svg';

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

// Need to hold user state to check which type of user they are and conditionally render editing fields in this component
// for user level block access to all except for the ones checked
const EditProject = ({
  projectToEdit,
  userAccessLevel,
  updateProject,
  recurringEvents,
  createNewRecurringEvent,
  deleteRecurringEvent,
  updateRecurringEvent,
}) => {
  const [formData, setFormData] = useState({
    name: projectToEdit.name,
    description: projectToEdit.description,
    location: projectToEdit.location,
    // githubIdentifier: projectToEdit.name,
    githubUrl: projectToEdit.githubUrl,
    slackUrl: projectToEdit.slackUrl,
    googleDriveUrl: projectToEdit.googleDriveUrl,
    // hflaWebsiteUrl: projectToEdit.name,
  });
  const [locationType, setLocationType] = React.useState('remote');
  // Set up to hold state for location type when added to add projects.
  //********** */
  const [selected, setSelected] = useState('');
  const isButtonSelected = (value) => {
    if (selected === value) {
      return true;
    }
  };
  //********** */
  // eslint-disable-next-line no-unused-vars

  const [rEvents, setREvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState();
  const [isCreateNew, setIsCreateNew] = useState();

  // States for alerts
  const [eventAlert, setEventAlert] = useState(null);

  // Holds active state for close/save buttons
  const [activeButton, setActiveButton] = React.useState('close');

  // Form inputs.
  const simpleInputs = [
    {
      label: 'Project Name',
      name: 'name',
      type: 'text',
      value: projectToEdit.name,
    },
    {
      label: 'Project Description',
      name: 'description',
      type: 'textarea',
      value: projectToEdit.description,
    },
    {
      label: 'Location',
      name: 'location',
      type: 'text',
      value: projectToEdit.location,
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
      value: projectToEdit.githubUrl,
    },
    {
      label: 'Slack Channel Link',
      name: 'slackUrl',
      type: 'text',
      value: projectToEdit.slackUrl,
    },
    {
      label: 'Google Drive URL',
      name: 'googleDriveUrl',
      type: 'text',
      value: projectToEdit.googleDriveUrl,
    },
    // Leaving incase we want to add this back in for updating projects
    // {
    //   label: 'HFLA Website URL',
    //   name: 'hflaWebsiteUrl',
    //   type: 'text',
    //   value: projectToEdit.hflaWebsiteUrl,
    // },
  ];

  // Get project recurring events when component loads
  useEffect(() => {
    if (recurringEvents) {
      setREvents(
        recurringEvents
          // eslint-disable-next-line no-underscore-dangle
          .filter((e) => e?.project?._id === projectToEdit._id)
          .map((item) => readableEvent(item))
          .sort((a, b) => a.dayOfTheWeekNumber - b.dayOfTheWeekNumber)
      );
    }
  }, [projectToEdit, recurringEvents, setREvents]);

  // only handles radio button change
  const handleRadioChange = (event) => {
    setLocationType(event.target.value);
  };

  // updates state of formData onChange of any form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
  };

  // fires PUT request to update the project,

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectApi = new ProjectApiService();
    try {
      await projectApi.updateProject(projectToEdit._id, formData);
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

  // Displays the location radios if the input.type === 'location'. See below.
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
            checked={isButtonSelected('remote')}
            control={<StyledRadio size="small" />}
            label="Remote"
          />
          <Box sx={{ width: '10px' }} />
          <StyledFormControlLabel
            value="in-person"
            checked={isButtonSelected('in-person')}
            control={<StyledRadio size="small" />}
            label="In-Person"
          />
        </RadioGroup>
      </FormControl>
    </Grid>
  );

  return (
    <Box sx={{ px: 0.5 }}>
      <div className={`edit-meeting-modal ${selectedEvent ? 'active' : ''}`}>
        <EditMeetingTimes
          selectedEvent={selectedEvent}
          setEventAlert={setEventAlert}
          setSelectedEvent={setSelectedEvent}
          deleteRecurringEvent={deleteRecurringEvent}
          updateRecurringEvent={updateRecurringEvent}
        />
      </div>
      <div className={`edit-meeting-modal ${isCreateNew ? 'active' : ''}`}>
        <CreateNewEvent
          createNewRecurringEvent={createNewRecurringEvent}
          projectName={projectToEdit.name}
          // eslint-disable-next-line no-underscore-dangle
          projectID={projectToEdit._id}
          setEventAlert={setEventAlert}
          setIsCreateNew={setIsCreateNew}
        />
      </div>
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
        </Box>
        <Divider sx={{ borderColor: 'rgba(0,0,0,1)' }} />
        <Box sx={{ py: 2, px: 4 }}>
          <form id="project-form" onSubmit={handleSubmit}>
            {simpleInputs.map((input, event) => (
              <Box sx={{ mb: 1 }} key={input.name}>
                <Grid container alignItems="center">
                  <Grid item xs="auto" sx={{ pr: 3 }}>
                    <InputLabel
                      sx={{ width: 'max-content', ml: 0.5, mb: 0.5 }}
                      id={input.name}
                      value={input.value}
                    >
                      {input.label}
                    </InputLabel>
                  </Grid>

                  {input.name === 'location' && locationRadios}
                </Grid>
                <TextField
                  id={input.name}
                  name={input.name}
                  placeholder={
                    input.name === 'location'
                      ? locationType === 'remote'
                        ? 'Enter project zoom link'
                        : 'Enter project street address'
                      : ''
                  }
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

      <Box sx={{ bgcolor: '#F5F5F5', my: 2 }}>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>
              Recurring Events
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              '&:hover': { color: 'red', cursor: 'default' },
            }}
            onClick={() => setIsCreateNew(true)}
          >
            <PlusIcon style={{ marginRight: '7px' }} />
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Add New Event
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'rgba(0,0,0,1)' }} />
        <Box sx={{ py: 2, px: 4 }}>
          <div className="event-list">
            <h2 className="event-alert">{eventAlert}</h2>
            <ul>
              {rEvents.map((event) => (
                // eslint-disable-next-line no-underscore-dangle
                <li key={`${event.event_id}`}>
                  <button type="button" onClick={() => setSelectedEvent(event)}>
                    <div>{event.name}</div>
                    <div className="event-list-details">
                      {`${event.dayOfTheWeek}, ${event.startTime} - ${event.endTime}; ${event.eventType}`}
                      <div className="edit-icon">
                        <EditIcon />
                      </div>
                    </div>
                    <div className="event-list-description">{`${event.description}`}</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="display-events"></div>
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center' }}></Box>
      <Box>
        <Grid container justifyContent="space-evenly" sx={{ my: 3 }}>
          <Grid item xs="auto">
            <StyledButton
              type="submit"
              form="project-form"
              variant={activeButton === 'save' ? 'contained' : 'secondary'}
              disabled={activeButton !== 'save'}
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
  );
};

export default EditProject;
