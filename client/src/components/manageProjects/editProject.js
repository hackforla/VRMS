import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EditableField from './editableField';
import EditMeetingTimes from './editMeetingTimes';
import CreateNewEvent from './createNewEvent';
import readableEvent from './utilities/readableEvent';
import '../../sass/ManageProjects.scss';

// Need to hold user state to check which type of user they are and conditionally render editing fields in this component
// for user level block access to all except for the ones checked
const EditProject = ({
  projectToEdit,
  userAccessLevel,
  updateProject,
  recurringEvents,
  createNewRecurringEvent,
  deleteRecurringEvent,
  updateRecurringEvent,
}) => {
  // Add commas to arrays for display
  const partnerDataFormatted = projectToEdit.partners.join(', ');
  const recrutingDataFormatted = projectToEdit.recruitingCategories.join(', ');
  const managedByUsersDataFormatted = projectToEdit.managedByUsers.join(', ');
  const [rEvents, setREvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState();
  const [isCreateNew, setIsCreateNew] = useState();

  // States for alerts
  const [eventAlert, setEventAlert] = useState(null);

  // Get project recurring events when component loads
  useEffect(() => {
    if (recurringEvents) {
      setREvents(
        recurringEvents
          // eslint-disable-next-line no-underscore-dangle
          .filter((e) => e?.project?._id === projectToEdit._id)
          .map((item) => readableEvent(item))
          .sort((a, b) => a.dayOfTheWeekNumber - b.dayOfTheWeekNumber)
      );
    }
  }, [projectToEdit, recurringEvents, setREvents]);

  return (
    <div>
      <div className={`edit-meeting-modal ${selectedEvent ? 'active' : ''}`}>
        <EditMeetingTimes
          selectedEvent={selectedEvent}
          setEventAlert={setEventAlert}
          setSelectedEvent={setSelectedEvent}
          deleteRecurringEvent={deleteRecurringEvent}
          updateRecurringEvent={updateRecurringEvent}
        />
      </div>
      <div className={`edit-meeting-modal ${isCreateNew ? 'active' : ''}`}>
        <CreateNewEvent
          createNewRecurringEvent={createNewRecurringEvent}
          projectName={projectToEdit.name}
          // eslint-disable-next-line no-underscore-dangle
          projectID={projectToEdit._id}
          setEventAlert={setEventAlert}
          setIsCreateNew={setIsCreateNew}
        />
      </div>
      <Link className="button-back" to={`/projects`}>
        Back to Select Project
      </Link>
      <div className="project-list-heading">{`Project: ${projectToEdit.name}`}</div>
      <EditableField
        fieldData={projectToEdit.name}
        fieldName="name"
        updateProject={updateProject}
        fieldTitle="Name:"
        accessLevel={userAccessLevel}
      />
      <EditableField
        fieldData={projectToEdit.description}
        fieldName="description"
        updateProject={updateProject}
        fieldType="textarea"
        fieldTitle="Description:"
        accessLevel={userAccessLevel}
      />
      <EditableField
        fieldData={projectToEdit.location}
        fieldName="location"
        updateProject={updateProject}
        fieldTitle="Location:"
        accessLevel={userAccessLevel}
      />
      <EditableField
        fieldData={projectToEdit.githubIdentifier}
        fieldName="githubIdentifier"
        updateProject={updateProject}
        fieldTitle="GitHub Identifier:"
        accessLevel={userAccessLevel}
      />
      <EditableField
        fieldData={projectToEdit.githubUrl}
        fieldName="githubUrl"
        updateProject={updateProject}
        fieldTitle="GitHib URL:"
        accessLevel={userAccessLevel}
      />
      <EditableField
        fieldData={projectToEdit.slackUrl}
        fieldName="slackUrl"
        updateProject={updateProject}
        fieldTitle="Slack URL:"
        accessLevel={userAccessLevel}
      />
      <EditableField
        fieldData={projectToEdit.googleDriveUrl}
        fieldName="googleDriveUrl"
        updateProject={updateProject}
        fieldTitle="Google Drive URL:"
        accessLevel={userAccessLevel}
        canEdit={['admin', 'user']}
      />
      <EditableField
        fieldData={projectToEdit.googleDriveId}
        fieldName="googleDriveId"
        updateProject={updateProject}
        fieldTitle="Google Drive ID:"
        accessLevel={userAccessLevel}
      />
      <EditableField
        fieldData={projectToEdit.hflaWebsiteUrl}
        fieldName="hflaWebsiteUrl"
        updateProject={updateProject}
        fieldTitle="HfLA Website URL:"
        accessLevel={userAccessLevel}
      />
      <EditableField
        fieldData={projectToEdit.videoConferenceLink}
        fieldName="videoConferenceLink"
        updateProject={updateProject}
        fieldTitle="Video Conference Link:"
        accessLevel={userAccessLevel}
        canEdit={['admin', 'user']}
      />
      <EditableField
        fieldData={projectToEdit.lookingDescription}
        fieldName="lookingDescription"
        updateProject={updateProject}
        fieldTitle="Looking For Description:"
        accessLevel={userAccessLevel}
      />
      <EditableField
        fieldData={managedByUsersDataFormatted}
        fieldName="managedByUsers"
        updateProject={updateProject}
        fieldTitle="Managed by Users (comma separated):"
        accessLevel={userAccessLevel}
        canEdit={['admin']}
      />
      <EditableField
        fieldData={partnerDataFormatted}
        fieldName="partners"
        updateProject={updateProject}
        fieldTitle="Partners (comma separated):"
        accessLevel={userAccessLevel}
        canEdit={['admin', 'user']}
      />
      <EditableField
        fieldData={recrutingDataFormatted}
        fieldName="recruitingCategories"
        updateProject={updateProject}
        fieldTitle="Recruiting Categories (comma separated):"
        accessLevel={userAccessLevel}
      />
      <div className="event-list">
        <h3>Recurring Events</h3>
        <h2 className="event-alert">{eventAlert}</h2>
        <ul>
          {rEvents.map((event) => (
            // eslint-disable-next-line no-underscore-dangle
            <li key={`${event.event_id}`}>
              <button type="button" onClick={() => setSelectedEvent(event)}>
                <div>{event.name}</div>
                <div className="event-list-details">{`${event.dayOfTheWeek}, ${event.startTime} - ${event.endTime}; ${event.eventType}`}</div>
                <div className="event-list-description">{`${event.description}`}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="display-events">
        <button
          type="button"
          className="create-form-button"
          onClick={() => setIsCreateNew(true)}
        >
          Create New Event
        </button>
      </div>
    </div>
  );
};

export default EditProject;
