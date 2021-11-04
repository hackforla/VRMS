import React, { useState, useEffect } from 'react';
import '../../sass/ManageProjects.scss';


const EditableMeeting  = ( { 
  event_id, eventDescription, eventDay,eventStartTime,eventEndTime, handleEventUpdate, handleResetEvent, handleEventDelete 
} ) => {

  // State variables
  const [descriptionState, setDescriptionState] = useState(eventDescription);
  const [dayState, setDayState] = useState(eventDay);
  const [startState, setStartState] = useState(eventStartTime);
  const [endState, setEndState] = useState(eventEndTime);

  // Helper functions

  // These are the hours of the day in an array to make setting the time options faster and cleaner
  function createClockHours () {

    let hours = [12];
    let clockHours = [];

    for (let i = 1; i < 12; i++) {
      hours.push(i);
    }

    let aorp = 'am';
    for (let i = 0; i < 2; i++) {
      for (const d of hours) {
          clockHours.push(d + ':00' + aorp);
          clockHours.push(d + ':30' + aorp);
      }
      aorp = "pm"; 
    }
    return clockHours;
  }

  let clockHours = createClockHours();

  // Handle clicks and such
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
      <span className="editable-field">Start Time:</span>
      <select value={endState} onChange={handleEndChange}>
      {clockHours.map((value,index) => {
        return (
            <option key={index} value={value}>{value}</option>
        )})}
      </select> 
    </div>
    <div>
      <span className="project-edit-button" onClick={handleEventUpdate(event_id)} >[UPDATE]</span>
      <span className="project-edit-button" onClick={handleResetEvent(event_id)} >[RESET]</span>
      <span className="project-edit-button" onClick={handleEventDelete(event_id)} >[DELETE]</span>
    </div>
  </div>
  )
};

export default EditableMeeting;