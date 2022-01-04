import React, { useState, useEffect } from 'react';
import '../../sass/ManageProjects.scss';
import { createClockHours } from '../../utils/createClockHours';
import { REACT_APP_CUSTOM_REQUEST_HEADER } from "../../utils/globalSettings";

const CreateNewEvent  = ( { 
  projectName, 
  projectID, 
  reRender 
} ) => {

  const headerToSend = REACT_APP_CUSTOM_REQUEST_HEADER;

  /*** Initialize state ***/

  // These are the initial form values
  const initialFormValues = {
    name: `${projectName} Team Meeting`,
    eventType: 'Team Meeting',
    day: '0',
    startTime: '7:00pm',
    duration: '1'
  }

  // Is the create form displayed or not?
  const [displayForm, setDisplayForm] = useState(false);
  // Hold current form values
  const [formValues, setFormValues] = useState(initialFormValues);

  /*** On Click funtions ***/

  // Toggle new event form display
  const handleFormDisplay = () => {
    setDisplayForm(true);
  }

  const cancelForm = () => {
    setFormValues({});
    setDisplayForm(false);
    // ToDo: set to scroll to the top when form is cancelled
  }

  // Handle form input changes
  const handleInputChange = (event) => {
    setFormValues({ ...formValues, [event.target.name]: event.target.value })
  }

  // Function to Create New reurringEvent
  const createNewRecurringEvent = async (eventToCreate) => {
    const url = `/api/recurringEvents/`;
    const requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "x-customrequired-header": headerToSend
        },
        body: JSON.stringify(eventToCreate)
    };
  
    const response = await fetch(url, requestOptions); 
    if (!response.ok) {
      throw new Error(`HTTP error!  ${response.status}`);
    }
    const data = await response.json();
      return data;
  }
  
  const handleEventCreate = (event) => {

    /* ToDo: Ask Bonnie what, if any, validation is required */

    // Find the date for the next occurance of day of the week
    let day = parseInt(formValues.day);
    const date = new Date();
    date.setDate(date.getDate() + ((7 - date.getDay()) % 7 + day) % 7);

    // reconstitute time from form to timestamp
    const timeParts = formValues.startTime.split(':');
    const sap = timeParts[1].slice(-2);
    // timeParts[1] = timeParts[1].slice(0,-2);
    let startHour = parseInt(timeParts[0]);
    const startMinutes = parseInt(timeParts[1].slice(0,-2));
    const startSeconds = 0;
    
    // set 12am to 0 and make afternoon into military time
    if (sap === 'pm' && startHour !== 12) {
      startHour = startHour + 12;
    } else if (sap === 'am' && startHour === 12) {
      startHour = 0;
    }

    // Update the date string with the start hours of the meeting
    date.setHours(startHour);
    date.setMinutes(startMinutes);
    date.setSeconds(startSeconds);

    // This is the date and time of the first meeting.
    // This will also be used as the start time 
    const startTimeDate = new Date(date.getTime());
    let endTime;

    // Create the endTime by adding seconds to the timestamp and converting it back to date
    switch (formValues.duration) {
      case '.5':
        endTime = new Date(date.getTime() + (.5*3600000)); 
      break;
      case '1':
        endTime = new Date(date.getTime() + (1*3600000)); 
      break;
      case '1.5':
        endTime = new Date(date.getTime() + (1.5*3600000)); 
      break;
      case '2':
        endTime = new Date(date.getTime() + (2*3600000)); 
        break;
      case '2.5':
        endTime = new Date(date.getTime() + (2.5*3600000));
      break;
      case '3':
        endTime = new Date(date.getTime() + (3*3600000));
      break;
      case '3.5':
        endTime = new Date(date.getTime() + (3.5*3600000));
      break;
      case '4':
        endTime = new Date(date.getTime() + (4*3600000));
      break;
      default:
        // ToDo: Change this to report some kind of error
        endTime = new Date(date.getTime()) 
    } 

    //convert to ISO and GMT
    const startDateTimeGMT = new Date(startTimeDate).toISOString();
    const endTimeGMT = new Date(endTime).toISOString();

    const createdDate = new Date().toISOString();
    const updatedDate = new Date().toISOString();

    // This is the new event object
    // Certain values - like 'location' - are hard-coded here as they are constant
    const theNewEvent = {
      name: formValues.name,
      location: {
          city: "Los Angeles",
          state: "CA",
          country: "USA"
      },
      hacknight: "Online",
      brigade: "Hack for LA",
      eventType: formValues.eventType,
      description: formValues.description,
      project: projectID,                                                
      date: startDateTimeGMT,   
      startTime: startDateTimeGMT,
      endTime: endTimeGMT,
      hours: formValues.duration.toString(),
      createdDate: createdDate,
      updatedDate: updatedDate,
      checkInReady: false,
      videoConferenceLink: formValues.videoConferenceLink
    };
 
      console.log(theNewEvent);
      createNewRecurringEvent(theNewEvent)
      .then( (data) => {
        reRender(data)
      })
      .catch( (error) => {
        console.log(`Create Recurring Event Error: `, error);
        alert("Server not responding.  Please try again.");
      });
    }

    // Handle submission of new recurring event form
    const handleFormSubmit = () => {
      handleEventCreate();
      setFormValues(initialFormValues);
      setDisplayForm(false);
      // ToDo: Re-render the page after submit
    }

  // This creates the clock hours for the form
  const clockHours = createClockHours();

  if (displayForm){
    return (
      <div className="event-form-box">
        <h3 className="event-form-title">Create New Recurring Event</h3>
          <label>Meeting Name:</label>
            <input
              placeholder='Meeting name...'
              name='name'
              value={formValues.name}
              onChange={handleInputChange}
          />
          <label>Event Type:</label>
          <select 
              value={formValues.eventType} 
              onChange={handleInputChange}
              name='eventType'
              defaultValue='Team Meeting'
            >
              <option selected value="Team Meeting">Team Meeting</option>
              <option value="Onboarding">Onboarding</option>
            </select>
          <label>Description:</label>
            <input
              placeholder='Meeting description...'
              name='description'
              value={formValues.description}
              onChange={handleInputChange}
            />
          <label>Videoconference Link:</label>
            <input
              placeholder='Videoconference Link...'
              name='videoConferenceLink'
              value={formValues.videoConferenceLink}
              onChange={handleInputChange}
            />
          <label>Day of the Week:</label>
            <select 
              value={formValues.day} 
              onChange={handleInputChange}
              name='day'
            >
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
            </select>
          <label>Start Time:</label>
            <select 
              value={formValues.startTime} 
              onChange={handleInputChange}
              name='startTime'
            >
              {clockHours.map((value,index) => {
              return (
                  <option key={index} value={value}>{value}</option>
              )})}
            </select>
          <label>Duration:</label>
            <select 
              value={formValues.duration} 
              onChange={handleInputChange}
              name='duration'
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
          <div className="button-box">
            <span className="createBtn" onClick={() => {handleFormSubmit()}}>Create New Event</span>
            <span className="cancelBtn" onClick={() => {cancelForm()}}>Cancel</span>
          </div>
        </div>
    ) 
  } else {
    return (
      <div className="display-events">
        <span className="button-create-event" onClick={() => {handleFormDisplay()}} >Create New Event</span>
      </div>
    )
  }
};

export default CreateNewEvent;