import React, { useState } from 'react';
import '../../sass/ManageProjects.scss';
import { useSnackbar } from '../../context/snackbarContext';
import EditableMeeting from './editableMeeting';
import { findNextOccuranceOfDay } from './utilities/findNextDayOccuranceOfDay';
import { addDurationToTime } from './utilities/addDurationToTime';
import { timeConvertFromForm } from './utilities/timeConvertFromForm';
import validateEventForm from './utilities/validateEventForm';
import { IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// This component displays current meeting times for selected project and offers the option to edit those times.
const EditMeetingTimes = ({
  projectToEdit,
  selectedEvent,
  setSelectedEvent,
  deleteRecurringEvent,
  updateRecurringEvent,
}) => {
  const [formErrors, setFormErrors] = useState({});
  const { showSnackbar } = useSnackbar();
  const handleEventUpdate = (
    eventID,
    values,
    startTimeOriginal,
    durationOriginal
  ) => async () => {
    const errors = validateEventForm(values, projectToEdit);
    if (!errors) {
      let theUpdatedEvent = {};

      if (values.name) {
        theUpdatedEvent = {
          ...theUpdatedEvent,
          name: values.name,
        };
      }

      if (values.eventType) {
        theUpdatedEvent = {
          ...theUpdatedEvent,
          eventType: values.eventType,
        };
      }

      theUpdatedEvent = {
        ...theUpdatedEvent,
        description: values.description,
      };

      if (values.videoConferenceLink) {
        theUpdatedEvent = {
          ...theUpdatedEvent,
          videoConferenceLink: values.videoConferenceLink,
        };
      }

      // Set updated date to today and add it to the object
      const updatedDate = new Date().toISOString();
      theUpdatedEvent = {
        ...theUpdatedEvent,
        updatedDate,
      };

      // Find next occurance of Day in the future
      // Assign new start time and end time
      const date = findNextOccuranceOfDay(values.day);
      const startTimeDate = timeConvertFromForm(date, values.startTime);
      const endTime = addDurationToTime(startTimeDate, values.duration);

      // Revert timestamps to GMT
      const startDateTimeGMT = new Date(startTimeDate).toISOString();
      const endTimeGMT = new Date(endTime).toISOString();
        
      theUpdatedEvent = {
        ...theUpdatedEvent,
        date: startDateTimeGMT,
        startTime: startDateTimeGMT,
        endTime: endTimeGMT,
        duration: values.duration
      };

      updateRecurringEvent(theUpdatedEvent, eventID);
      showSnackbar("Recurring event updated", 'info')
      setSelectedEvent(null);
    }
    setFormErrors(errors);
  };

  const handleEventDelete = (eventID) => async () => {
    deleteRecurringEvent(eventID);
    setSelectedEvent(null);
    showSnackbar("Recurring event deleted", 'info');
  };

  return (
    <Box>
      <IconButton
        onClick={() => {
          setFormErrors(null);
          setSelectedEvent(null);
        }}
      >
        <CloseIcon />
      </IconButton>
      {selectedEvent && (
        <EditableMeeting
          key={selectedEvent.event_id}
          eventId={selectedEvent.event_id}
          eventName={selectedEvent.name}
          eventDescription={selectedEvent.description}
          eventType={selectedEvent.eventType}
          eventDayNumber={selectedEvent.dayOfTheWeekNumber}
          eventStartTime={selectedEvent.startTime}
          eventEndTime={selectedEvent.endTime}
          eventDuration={selectedEvent.duration}
          videoConferenceLink={selectedEvent.videoConferenceLink}
          formErrors={formErrors}
          handleEventUpdate={handleEventUpdate}
          handleEventDelete={handleEventDelete}
        />
      )}
    </Box>
  );
};
export default EditMeetingTimes;