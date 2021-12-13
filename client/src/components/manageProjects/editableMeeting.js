import React, { useState, useEffect } from 'react';
import '../../sass/ManageProjects.scss';
import { createClockHours } from '../../utils/createClockHours';

const EditableMeeting  = ( { 
  event_id, eventDescription, eventDay,eventStartTime,eventEndTime, handleEventUpdate, handleEventDelete, eventMeetingURL 
} ) => {

  // State variables
  const [descriptionState, setDescriptionState] = useState(eventDescription);
  const [dayState, setDayState] = useState(eventDay);
  const [startState, setStartState] = useState(eventStartTime);
  const [endState, setEndState] = useState(eventEndTime);
  const [meetingLinkState, setMeetingLinkState] = useState(eventMeetingURL);

  // Helper functions

  // create clock hours for form input
  let clockHours = createClockHours();

  // Handle state changes
  const handleDescriptionChange = event => {
    setDescriptionState(event.target.value);
  };  
  
  const handleDayChange = event => {
    setDayState(event.target.value);
  };   

  const handleStartChange = event => {
    setStartState(event.target.value);
  };  

  const handleEndChange = event => {
    setEndState(event.target.value);
  }; 
  
  const handleMeetingLinkChange = event => {
    setMeetingLinkState(event.target.value);
  }

  // Handle Clicks
  const handleResetEvent = (eventToEditID) => () => {
    setDescriptionState(eventDescription);
    setDayState(eventDay);
    setStartState(eventStartTime);
    setEndState(eventEndTime);
    setMeetingLinkState(eventMeetingURL);
  } 


  return (
    <div className="display-events">
    <div>
      <span className="editable-field">Description:</span>
      <input 
        type="text"
        value={descriptionState}
        onChange={handleDescriptionChange}
      />
    </div>
    <div>
      <span className="editable-field">Day:</span>
      <select value={dayState.toLowerCase()} onChange={handleDayChange}>
      <option value="sunday">Sunday</option>
      <option value="monday">Monday</option>
      <option value="tuesday">Tuesday</option>
      <option value="wednesday">Wednesday</option>
      <option value="thursday">Thursday</option>
      <option value="friday">Friday</option>
      <option value="saturday">Saturday</option>
      </select>
    </div>
    <div>
      <span className="editable-field">Start Time:</span>
      <select value={startState} onChange={handleStartChange}>
      {clockHours.map((value,index) => {
        return (
            <option key={index} value={value}>{value}</option>
        )})}
      </select>
    </div>
    <div>
      <span className="editable-field">End Time:</span>
      <select value={endState} onChange={handleEndChange}>
      {clockHours.map((value,index) => {
        return (
            <option key={index} value={value}>{value}</option>
        )})}
      </select> 
    </div>
    <div>
      <span className="editable-field">Meeting Link:</span>
      <input 
        type="text"
        value={meetingLinkState}
        onChange={handleMeetingLinkChange}
      />
    </div>
    <div>
      <span className="project-edit-button" onClick={handleEventUpdate(event_id,descriptionState,dayState,startState,endState)} >[UPDATE]</span>
      <span className="project-edit-button" onClick={handleResetEvent(event_id)} >[RESET]</span>
      <span className="project-edit-button" onClick={handleEventDelete(event_id)} >[DELETE]</span>
    </div>
  </div>
  )
};

export default EditableMeeting;