import React, { useState, useEffect }  from 'react';
import '../../sass/ManageProjects.scss';
import EditableMeeting from './editableMeeting';
import { REACT_APP_CUSTOM_REQUEST_HEADER } from "../../utils/globalSettings";

// This component displays current meeting times for selected project and offers the option to edit those times. 
const EditMeetingTimes  = (props) => {

  // Initialize state
  const [rEvents, setREvents] = useState([]);
  const [eventToEdit, setEventToEdit] = useState('');
  const [editTrue, setEventTrue] = useState(false);
  const [eventToEditInfo, setEventToEditInfo] = useState({});

  // Filters the recurring events to select for the selected projects. 
  const thisProjectRecurringEvents = (projectToEditID) => { 
    setREvents(props.recurringEvents.filter(e => (e?.project._id === projectToEditID)));
  }

  // Get project recurring events when component loads
  useEffect(() => {
    thisProjectRecurringEvents(props.projectToEdit._id);
  }, [])

  // Translate event data into human readable format

  /* 
  This makes the dates into human readable text.  However, it may ultimately be necessary to do some
  additional work on the time and time zone stuff, or to simply use a 
  library like momentjs (https://momentjs.com/timezone/) 
  */

  function readableEvent (e) {

    //let description = e.description;

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
    let startTime = startHours + ":" + startMinutes + " " + startAorP;

    // Convert end time from 24 to 12 and make pretty
    let eHours = end.getHours();
    let endHours = (eHours % 12) || 12;
    let endMinutes = (end.getMinutes() < 10 ? '0' : '') + end.getMinutes();
    let endAorP = eHours >= 12 ? 'pm' : 'am';
    let endTime = endHours + ":" + endMinutes + " " + endAorP;

    // Create readable object for this event
    let newEvent = {
      description: e.description,
      dayOfTheWeekNumber: dayOfTheWeekNumber,
      dayOfTheWeek: dayOfTheWeek,
      startTime: startTime,
      endTime: endTime,
      event_id: e._id
    }

    return newEvent;
  }

  // Map new array of readable event objects
  let processedEvents = rEvents.map(function(item) {
    return readableEvent(item);
  });


  const handleEditEventClick = (eventToEditID) => () => {
    setEventToEdit(eventToEditID);
    setEventToEditInfo  (props.recurringEvents.find(e => (e?._id === eventToEditID)));
    setEventTrue(true);

    console.log('eid', eventToEditID);
    console.log('re', props.recurringEvents);

  }

  return (
    <div>
	    <div className="project-list-heading">Project: {props.projectToEdit.name}</div>
      <div className="project-list-heading">Edit Recurring Events</div>

      {editTrue ?

        <div>
          <EditableMeeting
            theEvent={eventToEditInfo}
          />
        </div>
      :
        processedEvents.map(rEvent => (
          <div className="display-events">
            <div>Description: {rEvent.description}</div>
            <div>Day: {rEvent.dayOfTheWeek}</div>
            <div>Start Time: {rEvent.startTime} </div>
            <div>End Time: {rEvent.endTime} </div>
            <div><span className="project-edit-button" onClick={handleEditEventClick(rEvent.event_id)} > [edit]</span></div>
          </div>
        ))
      }

      <div><button className="button-back" onClick={props.goEditProject}>Back to Edit Project</button></div>
      <div><button className="button-back" onClick={props.goSelectProject}>Back to Select Project</button></div>
    </div>
  );

};

export default EditMeetingTimes;