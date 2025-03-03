import React, { useState, useEffect } from 'react';
import EditMeetingTimes from './editMeetingTimes';
import CreateNewEvent from './createNewEvent';
import readableEvent from './utilities/readableEvent';
import ProjectForm from '../ProjectForm';
import { simpleInputs, additionalInputsForEdit } from '../data';
import TitledBox from '../parts/boxes/TitledBox';

import { ReactComponent as EditIcon } from '../../svg/Icon_Edit.svg';
import { ReactComponent as PlusIcon } from '../../svg/PlusIcon.svg';

import { Typography, Box } from '@mui/material';

// Need to hold user state to check which type of user they are and conditionally render editing fields in this component
// for user level block access to all except for the ones checked
const EditProject = ({
  projectToEdit,
  recurringEvents,
  createNewRecurringEvent,
  deleteRecurringEvent,
  updateRecurringEvent,
  regularEvents,
  updateRegularEvent,
}) => {
  const [formData, setFormData] = useState({
    name: projectToEdit.name,
    description: projectToEdit.description,
    location: projectToEdit.location,
    githubIdentifier: projectToEdit.githubIdentifier,
    githubUrl: projectToEdit.githubUrl,
    slackUrl: projectToEdit.slackUrl,
    googleDriveUrl: projectToEdit.googleDriveUrl,
    hflaWebsiteUrl: projectToEdit.hflaWebsiteUrl,
    // this feature is commented out as per the PR #1577
    // partners: projectToEdit.partners,
    // managedByUsers: projectToEdit.managedByUsers,
    // projectStatus: projectToEdit.projectStatus,
    // comment out as per PR #1584
    // googleDriveId: projectToEdit.googleDriveId,
    // createdDate: new Date(projectToEdit.createdDate)
  });

  // eslint-disable-next-line no-unused-vars

  const [rEvents, setREvents] = useState([]);
  const [regularEventsState, setRegularEventsState] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState();
  const [isCreateNew, setIsCreateNew] = useState();

  // States for alerts
  const [eventAlert, setEventAlert] = useState(null);

  // test
  useEffect(() => {
    if (regularEvents) {
      setRegularEventsState(
        regularEvents
          // eslint-disable-next-line no-underscore-dangle
          .filter((e) => e?.project?._id === projectToEdit._id)
          .map((item) => ({ ...item, ...readableEvent(item), raw: item }))
          .reverse() // sorts most recent events first
      );
    }
  }, [projectToEdit, regularEvents, setRegularEventsState]);

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
    <Box sx={{ px: 0.5 }}>
      <div className={`edit-meeting-modal ${selectedEvent ? 'active' : ''}`}>
        <EditMeetingTimes
          projectToEdit={projectToEdit}
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
          projectToEdit={projectToEdit}
          // eslint-disable-next-line no-underscore-dangle
          projectID={projectToEdit._id}
          setEventAlert={setEventAlert}
          setIsCreateNew={setIsCreateNew}
        />
      </div>
      <ProjectForm
        arr={[...simpleInputs, ...additionalInputsForEdit]}
        formData={formData}
        projectToEdit={projectToEdit}
        isEdit={true}
        setFormData={setFormData}
      />

      <TitledBox title="Recurring Events"
        badge={
          <Box
            sx={{
              display: 'flex',
              '&:hover': { color: 'red', cursor: 'pointer' },
            }}
            onClick={() => setIsCreateNew(true)}
          >
            <PlusIcon style={{ marginRight: '7px' }} />
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Add New Event
            </Typography>
          </Box>
        }
      >
        <div className="event-list">
          <h2 className="event-alert">{eventAlert}</h2>
          <ul>
            {rEvents.map((event) => (
              // eslint-disable-next-line no-underscore-dangle
              <li key={`${event.event_id}`}>
                <button type="button" onClick={() => setSelectedEvent(event)}>
                  <div>{event.name}</div>
                  <div className="event-list-details">
                    {`${event.dayOfTheWeek}, ${event.startTime} - ${event.endTime}; ${event.eventType}`}
                    <div className="edit-icon">
                      <EditIcon cursor="pointer" />
                    </div>
                  </div>
                  <div className="event-list-description">{`${event.description}`}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </TitledBox>

      <TitledBox title="Manually Edit Events Checkin">
        <div className="event-list">
          <h2 className="event-alert">{eventAlert}</h2>
          <ul>
            {regularEventsState.map((event, index) => (

              // eslint-dis able-next-line no-underscore-dangle
              <RegularEvent event={event} key={event._id} updateRegularEvent={updateRegularEvent} />
            ))}
          </ul>
        </div>
      </TitledBox>
    </Box>
  );
};

function RegularEvent({ event, updateRegularEvent }) {
  return (
    <li key={`${event.event_id}`}>
      <button type="button" onClick={async () => updateRegularEvent({ checkInReady: !event.checkInReady }, event.event_id)}>
        <div>{event.name}</div>
        <div className="event-list-details">
          {`${event.dayOfTheWeek}, ${event.startTime} - ${event.endTime}; ${event.eventType}`} {`${new Date(event.raw.startTime).toLocaleDateString()}`}
        </div>
        <div className="event-list-description">Is this event available for check in now?: <strong>{`${event.checkInReady ? "Yes" : "No"}`}</strong></div>
      </button>
    </li>
  )
}



export default EditProject;
