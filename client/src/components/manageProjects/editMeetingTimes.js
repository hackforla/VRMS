import React, { useState, useEffect }  from 'react';
import '../../sass/ManageProjects.scss';
import EditableMeeting from './editableMeeting';
import { REACT_APP_CUSTOM_REQUEST_HEADER } from "../../utils/globalSettings";
import CreateNewEvent from './createNewEvent';
import { readableEvent } from './utilities/readableEvent';
import { findNextOccuranceOfDay } from './utilities/findNextDayOccuranceOfDay';
import { addDurationToTime } from './utilities/addDurationToTime';
import { timeConvertFromForm } from './utilities/timeConvertFromForm';

// This component displays current meeting times for selected project and offers the option to edit those times. 
const EditMeetingTimes  = ({
  recurringEvents, 
  projectToEdit,
  goEditProject,
  goSelectProject
  }) => {

  const headerToSend = REACT_APP_CUSTOM_REQUEST_HEADER;
  const URL = process.env.NODE_ENV === 'prod' ? 'https://www.vrms.io' : 'http://localhost:4000';

  const [rEvents, setREvents] = useState([]);
  const [eventToEdit, setEventToEdit] = useState('');

  // Get project recurring events when component loads
  useEffect(() => {
    // Filters the recurring events for this project
    setREvents(recurringEvents.filter(e => (e?.project?._id === projectToEdit._id)));
  }, [])

  // Map new array of readable event objects
  let processedEvents = rEvents.map(function(item) {
    return readableEvent(item);
  });

  /*** Re render functions ***/
  const deleteEventReRender = (data) => {
    setREvents(rEvents.filter(e => (e._id !== data._id)));
  }

  const newEventReRender = (data) => {
    setREvents([data, ...rEvents]);
  }

  const updateEventReRender = (data) => {
    let uEvents = [];
    
    for (let i = 0; i < rEvents.length; i++) {
      if (rEvents[i]._id === data._id) {
        uEvents.push(data);
      } else {
        uEvents.push(rEvents[i]);
      }
    }
    setREvents(uEvents);
  };

  // update reurringEvent
  const updateRecurringEvent = async (eventToUpdate, RecurringEventID) => {

    const url = `/api/recurringEvents/${RecurringEventID}`;
    const requestOptions = {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "x-customrequired-header": headerToSend
        },
        body: JSON.stringify(eventToUpdate)
    };
    const response = await fetch(url, requestOptions); 
    if (!response.ok) {
      throw new Error(`HTTP error!  ${response.status}`);
    }
    const data = await response.json();
    return data;
  }

  const handleEventUpdate = ( eventID, values, startTimeOriginal, durationOriginal ) => () => {

    setEventToEdit(eventID);

    // ToDo: Add some validation.  What kind of validation do we need?
    // ToDo: Add some update confirmation so user knows the update was successful

    let theUpdatedEvent = {};

    if (values.name) {
      theUpdatedEvent = { 
        ...theUpdatedEvent, 
        name: values.name 
      };
    }

    if (values.eventType) {
      theUpdatedEvent = { 
        ...theUpdatedEvent, 
        eventType: values.eventType 
      };
    }

    if (values.description) {
      theUpdatedEvent = { 
        ...theUpdatedEvent, 
        description: values.description 
      };
    }

    if (values.meetingURL) {
      theUpdatedEvent = { 
        ...theUpdatedEvent, 
        videoConferenceLink: values.meetingURL 
      };
    }    

    // Set updated date to today and add it to the object
    const updatedDate = new Date().toISOString();
    theUpdatedEvent = {
      ...theUpdatedEvent, 
      updatedDate: updatedDate 
    };

    // If the day has been changed, find the next occurence of the changed day
    if (values.dayNumber) {
      const date = findNextOccuranceOfDay(values.dayNumber);
      const dateGMT = new Date(date).toISOString();

      theUpdatedEvent = {
        ...theUpdatedEvent, 
        date: dateGMT
      };
    }

    // Set start time, End time and Duration if either start time or duration is changed
    if ( values.startTime || values.duration ) {

      /*
      We need a start time and a duration to calculate everything we need.  
      If only the start time or only the duration is changing, 
      we use the previous time or duration for the calculation.
      */

      let startTimeToUse = startTimeOriginal;
      let durationToUse = durationOriginal;

      if ( values.startTime ) {
        startTimeToUse = values.startTime;
      }

      if ( values.duration ) {
        durationToUse = values.duration;
      }

      const timeDate = timeConvertFromForm(new Date(), startTimeToUse);
      const endTime = addDurationToTime(timeDate, durationToUse); 

      //convert to ISO and GMT
      const startTimeGMT = new Date(timeDate).toISOString();
      const endTimeGMT = new Date(endTime).toISOString();

      theUpdatedEvent = { 
        ...theUpdatedEvent, 
        startTime: startTimeGMT,
        endTime: endTimeGMT,
        hours: durationToUse
      } 
    }

    updateRecurringEvent(theUpdatedEvent, eventID)
    .then( (data) => {
      updateEventReRender(data);
    })
    .catch( (error) => {
      console.log(`Update Recurring Event Error: `, error);
      alert("Server not responding.  Please try again.");
    });

  }

  /*** Delete Event Functions ***/
  const deleteRecurringEvent = async (RecurringEventID) => {
    const url = `/api/recurringEvents/${RecurringEventID}`;
    const requestOptions = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "x-customrequired-header": headerToSend
        },
    };

    const response = await fetch(url, requestOptions); 
    if (!response.ok) {
      throw new Error(`HTTP error!  ${response.status}`);
    }
    const data = await response.json();
    return data;
  }

  const handleEventDelete = (eventID) => () => {
    // ToDo: Add delete confirmation so user knows the item has been deleted

    deleteRecurringEvent(eventID)
    .then( (data) => {
      deleteEventReRender(data);
    })
    .catch( (error) => {
      console.log(`Delete Event Error: `, error);
      alert("Server not responding.  Please try again.");
    });
  }

  return (
    <div>
      <div className="project-list-heading">Project: {projectToEdit.name}</div>
      <div>
        <CreateNewEvent 
          projectName = {projectToEdit.name}
          projectID = {projectToEdit._id}
          newEventReRender = {newEventReRender}
        />
      </div>
      <div className="project-list-heading">Edit Recurring Events</div>
      {processedEvents.map(rEvent => (
        <EditableMeeting
          key = {rEvent.event_id}
          event_id = {rEvent.event_id}
          eventName = {rEvent.name}
          eventDescription = {rEvent.description}
          eventType = {rEvent.eventType}
          eventDay = {rEvent.dayOfTheWeek}
          eventDayNumber = {rEvent.dayOfTheWeekNumber}
          eventStartTime = {rEvent.startTime}
          eventEndTime = {rEvent.endTime}
          eventDuration = {rEvent.duration}
          eventMeetingURL = {rEvent.videoConferenceLink}
          handleEventUpdate = {handleEventUpdate}
          handleEventDelete = {handleEventDelete}
         />
      ))}

      <div><button className="button-back" onClick={goEditProject}>Back to Edit Project</button></div>
      <div><button className="button-back" onClick={goSelectProject}>Back to Select Project</button></div>
    </div>
  );

};
export default EditMeetingTimes;
