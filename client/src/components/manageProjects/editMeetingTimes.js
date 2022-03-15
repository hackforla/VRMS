import React, { useState } from 'react';
import '../../sass/ManageProjects.scss';
import EditableMeeting from './editableMeeting';
import { findNextOccuranceOfDay } from './utilities/findNextDayOccuranceOfDay';
import { addDurationToTime } from './utilities/addDurationToTime';
import { timeConvertFromForm } from './utilities/timeConvertFromForm';
import validateEventForm from './utilities/validateEventForm';

// This component displays current meeting times for selected project and offers the option to edit those times.
const EditMeetingTimes = ({
  selectedEvent,
  setSelectedEvent,
  setShowUpdateEventAlert,
  deleteRecurringEvent,
  updateRecurringEvent,
}) => {
  const [formErrors, setFormErrors] = useState({});
  const handleEventUpdate = (
    eventID,
    values,
    startTimeOriginal,
    durationOriginal
  ) => async () => {
    const errors = validateEventForm(values);
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

      if (values.description) {
        theUpdatedEvent = {
          ...theUpdatedEvent,
          description: values.description,
        };
      }

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

      // If the day has been changed, find the next occurence of the changed day
      if (values.day) {
        const date = findNextOccuranceOfDay(values.day);
        const dateGMT = new Date(date).toISOString();

        theUpdatedEvent = {
          ...theUpdatedEvent,
          date: dateGMT,
        };
      }

      // Set start time, End time and Duration if either start time or duration is changed
      if (values.startTime || values.duration) {
        /*
        We need a start time and a duration to calculate everything we need.  
        If only the start time or only the duration is changing, 
        we use the previous time or duration for the calculation.
        */

        let startTimeToUse = startTimeOriginal;
        let durationToUse = durationOriginal;

        if (values.startTime) {
          startTimeToUse = values.startTime;
        }

        if (values.duration) {
          durationToUse = values.duration;
        }

        const timeDate = timeConvertFromForm(new Date(), startTimeToUse);
        const endTime = addDurationToTime(timeDate, durationToUse);

        // convert to ISO and GMT
        const startTimeGMT = new Date(timeDate).toISOString();
        const endTimeGMT = new Date(endTime).toISOString();

        theUpdatedEvent = {
          ...theUpdatedEvent,
          startTime: startTimeGMT,
          endTime: endTimeGMT,
          hours: durationToUse,
        };
      }

      updateRecurringEvent(theUpdatedEvent, eventID);
      setShowUpdateEventAlert(true);
      await setTimeout(() => {
        setShowUpdateEventAlert(false);
      }, 5000)
      setSelectedEvent(null);
    }
    setFormErrors(errors);
  };

  const handleEventDelete = (eventID) => () => {
    // ToDo: Add delete confirmation so user knows the item has been deleted
    deleteRecurringEvent(eventID);
    setSelectedEvent(null);
  };

  return (
    <div>
      <button
        type="button"
        className="meeting-cancel-button"
        onClick={() => {
          setFormErrors(null);
          setSelectedEvent(null);
        }}
      >
        X
      </button>
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
    </div>
  );
};
export default EditMeetingTimes;