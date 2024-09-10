import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import '../../sass/ManageProjects.scss';
import { useSnackbar } from '../../context/snackbarContext';
import EditableMeeting from './editableMeeting';
import { findNextOccuranceOfDay } from './utilities/findNextDayOccuranceOfDay';
import { addDurationToTime } from './utilities/addDurationToTime';
import { timeConvertFromForm } from './utilities/timeConvertFromForm';
import validateEventForm from './utilities/validateEventForm';

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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedEvent) {
      setOpen(true);
    }
  }, [selectedEvent]);

  const handleClose = () => {
    setOpen(false);
    setFormErrors(null);
    setSelectedEvent(null);
  };

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
      handleClose();
    }
    setFormErrors(errors);
  };

  const handleEventDelete = (eventID) => async () => {
    deleteRecurringEvent(eventID);
    showSnackbar("Recurring event deleted", 'info');
    handleClose();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-meeting-modal-title"
        aria-describedby="edit-meeting-modal-description"
      >
        <Box
          className="modal-box"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 450,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" id="edit-meeting-modal-title">
            Edit Meeting Times
          </Typography>
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
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default EditMeetingTimes;