import React, { useState } from 'react';
import '../../sass/ManageProjects.scss';
import { findNextOccuranceOfDay } from './utilities/findNextDayOccuranceOfDay';
import { addDurationToTime } from './utilities/addDurationToTime';
import { timeConvertFromForm } from './utilities/timeConvertFromForm';
import EventForm from './eventForm';

const CreateNewEvent = ({
  projectName,
  projectID,
  createNewRecurringEvent,
}) => {
  // These are the initial form values
  const initialFormValues = {
    name: `${projectName} Team Meeting`,
    eventType: 'Team Meeting',
    description: '',
    videoConferenceLink: '',
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

  const handleEventCreate = () => {
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

    createNewRecurringEvent(theNewEvent);
  };

  // Handle submission of new recurring event form
  const handleFormSubmit = () => {
    handleEventCreate();
    setFormValues(initialFormValues);
    setDisplayForm(false);
  };

  if (displayForm) {
    return (
      <EventForm
        handleInputChange={handleInputChange}
        formValues={formValues}
        title="Create New Recurring Event"
      >
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
      </EventForm>
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
