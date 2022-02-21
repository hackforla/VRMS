import React, { useState, useEffect } from 'react';
import '../../sass/ManageProjects.scss';
import EditableMeeting from './editableMeeting';
import CreateNewEvent from './createNewEvent';
import { readableEvent } from './utilities/readableEvent';
import { findNextOccuranceOfDay } from './utilities/findNextDayOccuranceOfDay';
import { addDurationToTime } from './utilities/addDurationToTime';
import { timeConvertFromForm } from './utilities/timeConvertFromForm';

// This component displays current meeting times for selected project and offers the option to edit those times.
const EditMeetingTimes = ({
  recurringEvents,
  projectToEdit,
  goEditProject,
  goSelectProject,
  createNewRecurringEvent,
  deleteRecurringEvent,
  updateRecurringEvent,
}) => {
  const [rEvents, setREvents] = useState([]);

  // Get project recurring events when component loads
  useEffect(() => {
    // Filters the recurring events for this project
    setREvents(
      // eslint-disable-next-line no-underscore-dangle
      recurringEvents.filter((e) => e?.project?._id === projectToEdit._id)
    );
  }, [projectToEdit, recurringEvents, setREvents]);

  // Map new array of readable event objects
  const processedEvents = rEvents.map((item) => readableEvent(item));

  const handleEventUpdate = (
    eventID,
    values,
    startTimeOriginal,
    durationOriginal
  ) => () => {
    // ToDo: Add some validation.  What kind of validation do we need?
    // ToDo: Add some update confirmation so user knows the update was successful

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
  };

  const handleEventDelete = (eventID) => () => {
    // ToDo: Add delete confirmation so user knows the item has been deleted
    deleteRecurringEvent(eventID);
  };

  return (
    <div>
      <div className="project-list-heading">{`Project: ${projectToEdit.name}`}</div>
      <div>
        <CreateNewEvent
          createNewRecurringEvent={createNewRecurringEvent}
          projectName={projectToEdit.name}
          // eslint-disable-next-line no-underscore-dangle
          projectID={projectToEdit._id}
        />
      </div>
      <div className="project-list-heading">Edit Recurring Events</div>
      {processedEvents.map((rEvent) => (
        <EditableMeeting
          key={rEvent.event_id}
          eventId={rEvent.event_id}
          eventName={rEvent.name}
          eventDescription={rEvent.description}
          eventType={rEvent.eventType}
          eventDayNumber={rEvent.dayOfTheWeekNumber}
          eventStartTime={rEvent.startTime}
          eventEndTime={rEvent.endTime}
          eventDuration={rEvent.duration}
          videoConferenceLink={rEvent.videoConferenceLink}
          handleEventUpdate={handleEventUpdate}
          handleEventDelete={handleEventDelete}
        />
      ))}

      <button type="button" className="button-back" onClick={goEditProject}>
        Back to Edit Project
      </button>
      <button type="button" className="button-back" onClick={goSelectProject}>
        Back to Select Project
      </button>
    </div>
  );
};
export default EditMeetingTimes;
