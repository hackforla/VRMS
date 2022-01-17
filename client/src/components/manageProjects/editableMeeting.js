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

  /*** Initializeation Station ***/
  // If meetingURL or description are 'undefined', set them to an empty string
  if (!eventMeetingURL) { eventMeetingURL = '' }
  if (!eventDescription) { eventDescription = '' }

  const initialUpdateFormValues = {
    name: `${eventName}`,
    description: `${eventDescription}`,
    eventType: `${eventType}`,
    day: `${eventDay}`,
    dayNumber: `${eventDayNumber}`,
    startTime: `${eventStartTime}`,
    endTime: `${eventEndTime}`,
    duration: `${eventDuration}`,
    meetingURL: `${eventMeetingURL}`
  };

  //One state to rule them all
  const [formValues, setFormValues] = useState({initialUpdateFormValues});

  /*** Helper functions ***/

  // create clock hours for form input
  let clockHours = createClockHours();

  // Handle form input changes
  const handleInputChange = (event) => {
    setFormValues({ ...formValues, [event.target.name]: event.target.value })
  }

  // Handle Clicks
  const handleResetEvent = (eventToEditID) => () => {
    setFormValues (initialUpdateFormValues);
  } 

  return (
    <div className="event-form-box">

      <div>
        <label>Name:</label>
        <input 
          name='name'
          value={formValues.name}
          onChange={handleInputChange}
          defaultValue={eventName}
        />
      </div>
      <div>
      <label>Meeting Type:</label>
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
        <label className="editable-field">Description:</label>
        <input 
          name='description'
          value={formValues.description}
          onChange={handleInputChange}
          defaultValue={eventDescription}
          placeholder='Enter event description...'
        />
      </div>
      <div>
        <label>Day:</label>
        <select 
          // value={formValues.day.toLowerCase()}
          value={formValues.dayNumber} 
          onChange={handleInputChange}
          name='dayNumber'
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
        <label>Start Time:</label>
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
      <div>
        <label>Duration: </label>
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
        <label>Meeting Link:</label>
        <input 
          value={formValues.meetingURL}
          onChange={handleInputChange}
          name='meetingURL'
          defaultValue={eventMeetingURL}
          placeholder='Enter meeting url...'
        />
      </div>
      <div>
        {/* ToDo: Redo these as 'button' rather than 'span'. Also, change class name to be more generic. */}
        <span className="createBtn" onClick={ handleEventUpdate(event_id, formValues, eventStartTime, eventDuration) } >UPDATE</span>
        <span className="createBtn" onClick={ handleResetEvent(event_id) }>RESET</span>
        <span className="createBtn" onClick={ handleEventDelete(event_id) } >DELETE</span>
      </div>
  </div>
  )
};

export default EditableMeeting;