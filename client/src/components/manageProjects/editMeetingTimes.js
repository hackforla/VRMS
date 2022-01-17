import React, { useState, useEffect }  from 'react';
import '../../sass/ManageProjects.scss';
import EditableMeeting from './editableMeeting';
import { REACT_APP_CUSTOM_REQUEST_HEADER } from "../../utils/globalSettings";
import CreateNewEvent from './createNewEvent';

// This component displays current meeting times for selected project and offers the option to edit those times. 
const EditMeetingTimes  = ({
  recurringEvents, 
  projectToEdit,
  fetchRecurringEvents,
  goEditProject,
  goSelectProject
  }) => {

  const headerToSend = REACT_APP_CUSTOM_REQUEST_HEADER;
  const URL = process.env.NODE_ENV === 'prod' ? 'https://www.vrms.io' : 'http://localhost:4000';

  // Initialize state
  const [rEvents, setREvents] = useState([]);

  // ToDo: Is this state needed? If not, remove it. 
  const [eventToEdit, setEventToEdit] = useState('');

  // Get project recurring events when component loads
  useEffect(() => {
    // Filters the recurring events for this project
    setREvents(recurringEvents.filter(e => (e?.project?._id === projectToEdit._id)));
  }, [])

  // Translate event data into human readable format
  function readableEvent (e) {

    // Get date for each of the parts of the event time/day   
    let d = new Date(e.date);
    let start = new Date(e.startTime);
    let end = new Date(e.endTime);

    //Get day of the week. (Get the day number for sorting)
    let options = { weekday: "long" };
    let dayOfTheWeek = Intl.DateTimeFormat("en-US", options).format(d);
    let dayOfTheWeekNumber = d.getDay();

    // Convert end time from 24 to 12 and make pretty
    let sHours = start.getHours();
    let startHours = (sHours % 12) || 12;
    let startMinutes = (start.getMinutes() < 10 ? '0' : '') + start.getMinutes();
    let startAorP = sHours >= 12 ? 'pm' : 'am';
    let startTime = startHours + ":" + startMinutes + startAorP;

    // Convert end time from 24 to 12 and make pretty
    let eHours = end.getHours();
    let endHours = (eHours % 12) || 12;
    let endMinutes = (end.getMinutes() < 10 ? '0' : '') + end.getMinutes();
    let endAorP = eHours >= 12 ? 'pm' : 'am';
    let endTime = endHours + ":" + endMinutes + endAorP;

    // Create readable object for this event
    let newEvent = {
      name: e.name,
      description: e.description,
      eventType: e.eventType,
      dayOfTheWeekNumber: dayOfTheWeekNumber,
      dayOfTheWeek: dayOfTheWeek,
      startTime: startTime,
      endTime: endTime,
      duration: e.hours,
      event_id: e._id,
      videoConferenceLink: e.videoConferenceLink
    }

    return newEvent;
  }

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
      if (rEvents[[i]]._id === data._id) {
        uEvents.push(data);
      } else {
        uEvents.push(rEvents[i]);
      }
    }
    setREvents(uEvents);
  };

    /*** Update Event Functions ***/

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

    // ToDo: Add some validation if you haven't made any changes, or have deleted the description field

    // Values that have been changed for will be added to the object and, in time, the database
    let theUpdatedEvent = {};

    // If the fields have been changed, add to object

    // Fields that don't need any processing
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

    // These need some processing before adding to the update object

    // If the day has been changed, find the next occurence of the changed day
    if (values.dayNumber) {
      let day = parseInt(values.dayNumber);
      const date = new Date();
      date.setDate(date.getDate() + ((7 - date.getDay()) % 7 + day) % 7); 
      
      const dateGMT = new Date(date).toISOString();

      theUpdatedEvent = {
        ...theUpdatedEvent, 
        date: dateGMT
      };
    }

    // Set start time, End time and Duration if either start time or duration is changed
    if ( values.startTime || values.duration ) {

      // ToTo: A lot of this code is reused from CreateNewEvent.js and could possibly be consolidated
      // Yes, I know, I should do it now, but I just want to get it working and then
      // I'll come back to it.  (See "Technical Debt")

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

      const timeDate = new Date();

      // ToDo: Make this a reusable function
      // reconstitute time from form back into timestamp
      let timeParts = startTimeToUse.split(':');
      const sap = timeParts[1].slice(-2);
      timeParts[1] = timeParts[1].slice(0,-2);
      let startHour = parseInt(timeParts[0]);
      const startMinutes = parseInt(timeParts[1]);
      const startSeconds = 0;
      
      // set 12am to 0 and make afternoon into military time
      if (sap === 'pm' && startHour !== 12) {
        startHour = startHour + 12;
      } else if (sap === 'am' && startHour === 12) {
        startHour = 0;
      }
  
      // Update the date string with the start hours of the meeting
      timeDate.setHours(startHour);
      timeDate.setMinutes(startMinutes);
      timeDate.setSeconds(startSeconds);
  
      // This is the date and time of the first meeting.
      // This will also be used as the start time
      //const startTimeDate = new Date(date.getTime());

      // ToDo: Make this a reusable function
      let endTime;

      // Create the endTime by adding seconds to the timestamp and converting it back date
      switch (durationToUse) {
        case '.5':
          endTime = new Date(timeDate.getTime() + (.5*3600000)); 
        break;
        case '1':
          endTime = new Date(timeDate.getTime() + (1*3600000)); 
        break;
        case '1.5':
          endTime = new Date(timeDate.getTime() + (1.5*3600000)); 
        break;
        case '2':
          endTime = new Date(timeDate.getTime() + (2*3600000)); 
        break;
        case '2.5':
          endTime = new Date(timeDate.getTime() + (2.5*3600000));
        break;
        case '3':
          endTime = new Date(timeDate.getTime() + (3*3600000));
        break;
        case '3.5':
          endTime = new Date(timeDate.getTime() + (3.5*3600000));
        break;
        case '4':
          endTime = new Date(timeDate.getTime() + (4*3600000));
        break;
        default:
          // I can't think of how it will get to default,  but I thought I'd put this here anyway
          endTime = new Date(timeDate.getTime()) 
      } 

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
