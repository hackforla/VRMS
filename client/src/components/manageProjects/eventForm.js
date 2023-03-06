import React from 'react';
import { createClockHours } from '../../utils/createClockHours';
import '../../sass/ManageProjects.scss';

const EventForm = ({
  title,
  formValues,
  formErrors,
  handleInputChange,
  children,
}) => {
  // This creates the clock hours for the form
  const clockHours = createClockHours();
  return (
    <div className="event-form-box">
      {title && <h3 className="event-form-title">{title}</h3>}
      <label className="event-form-label" htmlFor="name">
        Event Name:
        <input
          id="name"
          placeholder="Meeting name..."
          name="name"
          value={formValues.name}
          onChange={handleInputChange}
          maxLength={30}
        />
        {formErrors?.name ? (
          <div className="event-form-error">{formErrors.name}</div>
        ) : null}
      </label>
      <div className="event-form-row">
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
      </div>
      <div className="event-form-row">
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
      </div>
      <label className="event-form-label" htmlFor="description">
        Description:
        <input
          id="description"
          placeholder="Meeting description..."
          name="description"
          value={formValues.description}
          onChange={handleInputChange}
          maxLength={60}
        />
      </label>
      <label className="event-form-label" htmlFor="videoConferenceLink">
        Event Link:
        <input
          id="videoConferenceLink"
          placeholder="Enter meeting url..."
          name="videoConferenceLink"
          value={formValues.videoConferenceLink}
          onChange={handleInputChange}
        />
        {formErrors?.videoConferenceLink ? (
          <div className="event-form-error">
            {formErrors.videoConferenceLink}
          </div>
        ) : null}
      </label>

      {children}
    </div>
  );
};

export default EventForm;
