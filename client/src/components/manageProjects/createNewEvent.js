import React, { useState } from 'react';
import '../../sass/ManageProjects.scss';
import { createClockHours } from '../../utils/createClockHours';
import { REACT_APP_CUSTOM_REQUEST_HEADER } from '../../utils/globalSettings';
import { findNextOccuranceOfDay } from './utilities/findNextDayOccuranceOfDay';
import { addDurationToTime } from './utilities/addDurationToTime';
import { timeConvertFromForm } from './utilities/timeConvertFromForm';

const CreateNewEvent = ({ projectName, projectID, newEventReRender }) => {
  const headerToSend = REACT_APP_CUSTOM_REQUEST_HEADER;

  // These are the initial form values
  const initialFormValues = {
    name: `${projectName} Team Meeting`,
    eventType: 'Team Meeting',
    day: '0',
    startTime: '7:00pm',
    duration: '1',
  };

  const [displayForm, setDisplayForm] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);

  // **** On Click funtions ****
  // Toggle new event form display
  const handleFormDisplay = () => {
    setDisplayForm(true);
  };

  const cancelForm = () => {
    setFormValues(initialFormValues);
    setDisplayForm(false);
    // ToDo: set to scroll to the top when form is cancelled
  };

  // Handle form input changes
  const handleInputChange = (event) => {
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  };

  // TODO: Pull out to recurring events api service
  // *** Create New Recurring Event functions ***
  const createNewRecurringEvent = async (eventToCreate) => {
    const url = `/api/recurringEvents/`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-customrequired-header': headerToSend,
      },
      body: JSON.stringify(eventToCreate),
    };

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error!  ${response.status}`);
    }
    const data = await response.json();
    return data;
  };

  const handleEventCreate = () => {
    /* ToDo: Ask Bonnie what, if any, validation is required */

    const date = findNextOccuranceOfDay(formValues.day);
    const startTimeDate = timeConvertFromForm(date, formValues.startTime);
    const endTime = addDurationToTime(startTimeDate, formValues.duration);

    // convert to ISO and GMT
    const startDateTimeGMT = new Date(startTimeDate).toISOString();
    const endTimeGMT = new Date(endTime).toISOString();

    const createdDate = new Date().toISOString();
    const updatedDate = new Date().toISOString();

    // This is the new event object
    // Certain values - like 'location' - are hard-coded here as they are constant
    const theNewEvent = {
      name: formValues.name,
      location: {
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
      },
      hacknight: 'Online',
      brigade: 'Hack for LA',
      eventType: formValues.eventType,
      description: formValues.description,
      project: projectID,
      date: startDateTimeGMT,
      startTime: startDateTimeGMT,
      endTime: endTimeGMT,
      hours: formValues.duration.toString(),
      createdDate,
      updatedDate,
      checkInReady: false,
      videoConferenceLink: formValues.videoConferenceLink,
    };

    createNewRecurringEvent(theNewEvent)
      .then((data) => {
        newEventReRender(data);
      })
      .catch((error) => {
        console.log(`Create Recurring Event Error: `, error);
        alert('Server not responding.  Please try again.');
      });
  };

  // Handle submission of new recurring event form
  const handleFormSubmit = () => {
    handleEventCreate();
    setFormValues(initialFormValues);
    setDisplayForm(false);
  };

  // This creates the clock hours for the form
  const clockHours = createClockHours();

  // TODO: reusable event form component
  if (displayForm) {
    return (
      <div className="event-form-box">
        <h3 className="event-form-title">Create New Recurring Event</h3>
        <label className="event-form-label" htmlFor="name">
          Meeting Name:
          <input
            id="name"
            placeholder="Meeting name..."
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
          />
        </label>

        <label className="event-form-label" htmlFor="eventType">
          Event Type:
          <select
            id="eventType"
            value={formValues.eventType}
            onChange={handleInputChange}
            name="eventType"
          >
            <option value="Team Meeting">Team Meeting</option>
            <option value="Onboarding">Onboarding</option>
          </select>
        </label>

        <label className="event-form-label" htmlFor="description">
          Description:
          <input
            id="description"
            placeholder="Meeting description..."
            name="description"
            value={formValues.description}
            onChange={handleInputChange}
          />
        </label>

        <label className="event-form-label" htmlFor="videoConferenceLink">
          Videoconference Link:
          <input
            id="videoConferenceLink"
            placeholder="Videoconference Link..."
            name="videoConferenceLink"
            value={formValues.videoConferenceLink}
            onChange={handleInputChange}
          />
        </label>

        <label className="event-form-label" htmlFor="day">
          Day of the Week:
          <select
            id="day"
            value={formValues.day}
            onChange={handleInputChange}
            name="day"
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

        <label className="event-form-label" htmlFor="startTime">
          Start Time:
          <select
            id="startTime"
            value={formValues.startTime}
            onChange={handleInputChange}
            name="startTime"
          >
            {clockHours.map((value) => {
              return (
                <option key={value} value={value}>
                  {value}
                </option>
              );
            })}
          </select>
        </label>

        <label className="event-form-label" htmlFor="duration">
          Duration:
          <select
            id="duration"
            value={formValues.duration}
            onChange={handleInputChange}
            name="duration"
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

        <div className="button-box">
          <button
            type="button"
            className="create-form-button"
            onClick={() => {
              handleFormSubmit();
            }}
          >
            Create New Event
          </button>
          <button
            type="button"
            className="create-form-button"
            onClick={() => {
              cancelForm();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="display-events">
      <button
        type="button"
        className="create-form-button"
        onClick={() => {
          handleFormDisplay();
        }}
      >
        Create New Event
      </button>
    </div>
  );
};

export default CreateNewEvent;
