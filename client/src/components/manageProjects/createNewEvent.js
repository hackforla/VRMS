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

  // Initialize state
  const [displayForm, setDisplayForm] = useState(false);
  const [formValues, setFormValues] = useState({
    name: `${projectName} Team Meeting`,
    eventType: 'Team Meeting',
    day: '0',
    startTime: '7:00pm',
    duration: '1'
  });

  // Toggle new event form display
  const handleFormDisplay = () => {
    setDisplayForm(true);
  }
  const cancelForm = () => {
    setFormValues({});
    setDisplayForm(false);
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

    //Add some validation?!?!

    // Find the date for the next occurance of day of the week
    let day = parseInt(formValues.day);
    const date = new Date();
    date.setDate(date.getDate() + ((7 - date.getDay()) % 7 + day) % 7);

    // reconstitute time from form back into timestamp
    let timeParts = formValues.startTime.split(':');
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
    date.setHours(startHour);
    date.setMinutes(startMinutes);
    date.setSeconds(startSeconds);

    // This is the date and time of the first meeting.
    // This will also be used as the start time
    const startTimeDate = new Date(date.getTime());
    let endTime;

    // Create the endTime by adding seconds to the timestamp and converting it back date
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
        // I can't think of how it will get to default,  but I thought I'd put this here anyway
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
  
      createNewRecurringEvent(theNewEvent)
      .then( (data) => {
        reRender(data)
      })
      .catch( (error) => {
        console.log(`Create Recurring Event Error: `, error);
        alert("Server not responding.  Please try again.");
      });
    }

    const handleFormSubmit = (event) => {
      event.preventDefault();  
    
      handleEventCreate(event);
  

      /* Refactor this so that info isn't repeated to set form */
      // Reset page
      setFormValues({
        name: `${projectName} Team Meeting`,
        eventType: 'Team Meeting',
        day: '0',
        startTime: '7:00pm',
        duration: '1'
       });
      setDisplayForm(false);
      
    }

  // This creates the clock hours for the form
  const clockHours = createClockHours();

  useEffect(() => {

  }, [displayForm]);

  if (displayForm){
    return (
      <div className="event-form-box">
        <div>
          <div>
            <h3 className="event-form-title">Create New Meeting</h3>
            <form onSubmit={handleFormSubmit}>
              <label>Meeting Name:
                <input
                  placeholder='Meeting name...'
                  name='name'
                  value={formValues.name}
                  onChange={handleInputChange}
                  defaultValue={`${projectName} Team Meeting`}
              />
              </label>
              <label>Event Type:
              <select 
                  value={formValues.eventType} 
                  onChange={handleInputChange}
                  name='eventType'
                  defaultValue='Team Meeting'
                >
                  <option selected value="Team Meeting">Team Meeting</option>
                  <option value="Onboarding">Onboarding</option>
                </select>
              </label>
              <label>Description:
                <input
                  placeholder='Meeting description...'
                  name='description'
                  value={formValues.description}
                  onChange={handleInputChange}
                />
              </label>
              <label>Videoconference Link:
                <input
                  placeholder='Videoconference Link...'
                  name='videoConferenceLink'
                  value={formValues.videoConferenceLink}
                  onChange={handleInputChange}
                />
              </label>
              <label>Day of the Week: 
                <select 
                  value={formValues.day} 
                  onChange={handleInputChange}
                  name='day'
                  defaultValue='1'
                >
                  <option value="0">Sunday</option>
                  <option value="1">Monday</option>
                  <option value="2">Tuesday</option>
                  <option value="3">Wednesday</option>
                  <option value="4">Thursday</option>
                  <option value="5">Friday</option>
                  <option value="6">Saturday</option>
                </select>
              </label>
              <label>Start Time
                <select 
                  value={formValues.startTime} 
                  onChange={handleInputChange}
                  name='startTime'
                  defaultValue='7:00pm'
                >
                  {clockHours.map((value,index) => {
                  return (
                      <option key={index} value={value}>{value}</option>
                  )})}
                </select>
              </label>
              <label>Duration:
                <select 
                  value={formValues.duration} 
                  onChange={handleInputChange}
                  name='duration'
                  defaultValue='1'
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
              </label>
              <button className="createBtn" type="submit">Create New Event</button>
            </form>
            <div className="cancelBtn" onClick={() => {cancelForm()}} >Cancel</div>
          </div>
        </div>
      </div>
    ) 
  } else {
    return (
      <div className="display-events">
        <span className="project-edit-button" onClick={() => {handleFormDisplay()}} >[Create New Event]</span>
      </div>
    )
  }
};

export default CreateNewEvent;