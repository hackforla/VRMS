import React, { useState, useEffect } from 'react';
import '../../sass/ManageProjects.scss';
import { createClockHours } from '../../utils/createClockHours';

const EditableMeeting  = ( { 
  event_id, 
  eventName, 
  eventDescription, 
  eventType, 
  eventDay,
  eventDayNumber,
  eventStartTime,
  eventEndTime, 
  eventDuration,
  handleEventUpdate, 
  handleEventDelete, 
  eventMeetingURL 
} ) => {

  // If meetingURL or description are 'undefined', set them to an empty string

  if (!eventMeetingURL) {
    eventMeetingURL = ''
  }
  if (!eventDescription) {
    eventDescription = ''
  }

  //One state to rule them all
  const [formValues, setFormValues] = useState({
    // name: `${eventName}`,
    // description: `${eventDescription}`,
    // eventType: `${eventType}`,
    // day: `${eventDay}`,
    // startTime: `${eventStartTime}`,
    // endTime: `${eventEndTime}`,
    // duration: `${eventDuration}`,
    // meetingURL: `${eventMeetingURL}`
  });

  // Helper functions

  // create clock hours for form input
  let clockHours = createClockHours();

  // Handle form input changes
  const handleInputChange = (event) => {
    setFormValues({ ...formValues, [event.target.name]: event.target.value })
  }

  // Handle Clicks
  const handleResetEvent = (eventToEditID) => () => {

    setFormValues ( {
      // name: `${eventName}`,
      // description: `${eventDescription}`,
      // eventType: `${eventType}`,
      // day: `${eventDay}`,
      // startTime: `${eventStartTime}`,
      // endTime: `${eventEndTime}`,
      // duration: `${eventDuration}`,
      // meetingURL: `${eventMeetingURL}`
    } )
    
  } 

  return (
    <div className="display-events">
      <div>
    </div>
    <div>
      <span className="editable-field">Name:</span>
      <input 
        type='text'
        name='name'
        value={formValues.name}
        onChange={handleInputChange}
        defaultValue={eventName}
      />
    </div>
    <div>
    <span className="editable-field">Meeting Type:</span>
      <select 
        value={formValues.eventType} 
        onChange={handleInputChange}
        name='eventType'
        defaultValue={eventType}
      >
        <option value="Team Meeting">Team Meeting</option>
        <option value="Onboarding">Onboarding</option>
      </select>
    </div>
    <div>
      <span className="editable-field">Description:</span>
      <input 
        type="text"
        name='description'
        value={formValues.description}
        onChange={handleInputChange}
        defaultValue={eventDescription}
      />
    </div>
    <div>
      <span className="editable-field">Day:</span>
      <select 
        // value={formValues.day.toLowerCase()}
        value={formValues.day} 
        onChange={handleInputChange}
        name='day'
        //defaultValue={eventDay}
        defaultValue={eventDayNumber}
        >
      <option value="0">Sunday</option>
      <option value="1">Monday</option>
      <option value="2">Tuesday</option>
      <option value="3">Wednesday</option>
      <option value="4">Thursday</option>
      <option value="5">Friday</option>
      <option value="6">Saturday</option>
      </select>
    </div>
    <div>
      <span className="editable-field">Start Time:</span>
      <select 
        value={formValues.startTime} 
        onChange={handleInputChange}
        name='startTime'
        defaultValue={eventStartTime}
      >
      {clockHours.map((value,index) => {
        return (
            <option key={index} value={value}>{value}</option>
        )})}
      </select>
    </div>
    {/* } <div>
      <span className="editable-field">End Time:</span>
      <select 
        value={formValues.endTime}  
        onChange={handleInputChange}
        name='endTime'
        defaultValue={eventEndTime}
        >
      {clockHours.map((value,index) => {
        return (
            <option key={index} value={value}>{value}</option>
        )})}
      </select> 
    </div>
        */}
    <div>
      <span className="editable-field">Duration: </span>
      <select 
        value={formValues.duration} 
        onChange={handleInputChange}
        name='duration'
        defaultValue={eventDuration}
      >
        <option value=".5">.5</option>
        <option value="1">1</option>
        <option value="1.5">1.5</option>
        <option value="2">2</option>
        <option value="2.5">2.5</option>
        <option value="3">3</option>
        <option value="3.5">3.5</option>
        <option value="4">4</option>
      </select>
    </div>
    <div>
      <span className="editable-field">Meeting Link:</span>
      <input 
        type="text"
        value={formValues.meetingURL}
        onChange={handleInputChange}
        name='meetingURL'
        defaultValue={eventMeetingURL}
      />
    </div>
    <div>
      <span className="project-edit-button" onClick={handleEventUpdate(event_id, formValues, eventStartTime, eventDuration)} >[UPDATE]</span>
      <span className="project-edit-button" onClick={handleResetEvent(event_id)} >[RESET]</span>
      <span className="project-edit-button" onClick={handleEventDelete(event_id)} >[DELETE]</span>
    </div>
  </div>
  )
};

export default EditableMeeting;