import React, { useState } from 'react';
import EventForm from './eventForm';
import { Box, Button } from '@mui/material';
import '../../sass/ManageProjects.scss';

const EditableMeeting = ({
  eventId,
  eventName,
  eventDescription = '',
  eventType,
  eventDayNumber,
  eventStartTime,
  eventEndTime,
  eventDuration,
  handleEventUpdate,
  handleEventDelete,
  formErrors,
  videoConferenceLink = '',
}) => {
  // *** Initialization Station ***
  const initialUpdateFormValues = {
    name: `${eventName}`,
    description: `${eventDescription}`,
    eventType: `${eventType}`,
    day: `${eventDayNumber}`,
    startTime: `${eventStartTime}`,
    endTime: `${eventEndTime}`,
    duration: `${eventDuration}`,
    videoConferenceLink: `${videoConferenceLink}`,
  };

  // One state to rule them all
  const [formValues, setFormValues] = useState(initialUpdateFormValues);

  // *** Helper functions ***

  // Handle form input changes
  const handleInputChange = (event) => {
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  };

  // Handle Clicks
  const handleResetEvent = () => () => {
    setFormValues(initialUpdateFormValues);
  };

  return (
    <EventForm
      handleInputChange={handleInputChange}
      formValues={formValues}
      formErrors={formErrors}
      title="Edit Recurring Event"
    >
      <Box>
        <Button
          type="button"
          className="create-form-button"
          onClick={handleEventUpdate(
            eventId,
            formValues,
            eventStartTime,
            eventDuration
          )}
        >
          UPDATE
        </Button>
        <Button
          type="button"
          className="create-form-button"
          onClick={handleResetEvent(eventId)}
        >
          RESET
        </Button>
        <Button
          type="button"
          className="create-form-button"
          onClick={handleEventDelete(eventId)}
        >
          DELETE
        </Button>
      </Box>
    </EventForm>
  );
};

export default EditableMeeting;
