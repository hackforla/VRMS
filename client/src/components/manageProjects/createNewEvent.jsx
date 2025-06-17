import React, { useState } from 'react';
import { useSnackbar } from '../../context/snackbarContext';
import '../../sass/ManageProjects.scss';
import { findNextOccuranceOfDay } from './utilities/findNextDayOccuranceOfDay';
import { addDurationToTime } from './utilities/addDurationToTime';
import { timeConvertFromForm } from './utilities/timeConvertFromForm';
import validateEventForm from './utilities/validateEventForm';
import EventForm from './eventForm';
import { Box, Button, Modal } from '@mui/material';

const CreateNewEvent = ({
  isOpen,
  onClose,
  projectToEdit,
  projectID,
  createNewRecurringEvent,
  setIsCreateNew,
}) => {
  // These are the initial form values
  const initialFormValues = {
    name: '',
    eventType: 'Team Meeting',
    description: '',
    videoConferenceLink: '',
    day: '0',
    startTime: '7:00pm',
    duration: '1',
  };
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const { showSnackbar } = useSnackbar();

  // Handle form input changes
  const handleInputChange = (event) => {
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  };

  const handleEventCreate = () => {
    const date = findNextOccuranceOfDay(formValues.day);
    const startTimeDate = timeConvertFromForm(date, formValues.startTime);
    const endTime = addDurationToTime(startTimeDate, formValues.duration);

    // convert to ISO and GMT
    const startDateTimeGMT = new Date(startTimeDate).toISOString();
    const endTimeGMT = new Date(endTime).toISOString();

    const createdDate = new Date().toISOString();
    const updatedDate = new Date().toISOString();

    // This is the new event object
    // Certain values - like 'location' - are hard-coded here as they are constant
    const theNewEvent = {
      name: formValues.name,
      location: {
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
      },
      hacknight: 'Online',
      brigade: 'Hack for LA',
      eventType: formValues.eventType,
      description: formValues.description,
      project: projectID,
      date: startDateTimeGMT,
      startTime: startDateTimeGMT,
      endTime: endTimeGMT,
      hours: formValues.duration.toString(),
      createdDate,
      updatedDate,
      checkInReady: false,
      videoConferenceLink: formValues.videoConferenceLink,
    };

    createNewRecurringEvent(theNewEvent);
  };

  const handleClose = (event, reason) => {
    setFormErrors({});
    setFormValues(initialFormValues);
    if (onClose) {
      onClose(event, reason);
    }
  };

  // Handle submission of new recurring event form
  const handleFormSubmit = async () => {
    const errors = validateEventForm(formValues, projectToEdit);
    if (!errors) {
      handleEventCreate();
      setFormValues(initialFormValues);
      setIsCreateNew(false);
      showSnackbar('Event created!', 'success');
    }
    setFormErrors(errors);
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        className="modal-box"
        sx={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 450,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          pt: 4,
          px: 4,
          pb: 2,
        }}
      >
        <EventForm
          handleInputChange={handleInputChange}
          formValues={formValues}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          title="Create New Recurring Event"
        >
          <div className="button-box">
            <button
              type="button"
              className="create-form-button"
              onClick={() => {
                handleFormSubmit();
              }}
            >
              Create New Event
            </button>
          </div>
        </EventForm>
        <Button onClick={handleClose}>Close</Button>
      </Box>
    </Modal>
  );
};

export default CreateNewEvent;
