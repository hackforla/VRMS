import React, { useState, useEffect } from 'react';
import EditMeetingTimes from './editMeetingTimes';
import CreateNewEvent from './createNewEvent';
import readableEvent from './utilities/readableEvent';
import ProjectForm from '../ProjectForm';

import { ReactComponent as EditIcon } from '../../svg/Icon_Edit.svg';
import { ReactComponent as PlusIcon } from '../../svg/PlusIcon.svg';

import { Typography, Box, Divider } from '@mui/material';

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
  const [originalProjectData, setOriginalProjectData] = useState({
    name: projectToEdit.name,
    description: projectToEdit.description,
    location: projectToEdit.location,
    // githubIdentifier: projectToEdit.name,
    githubUrl: projectToEdit.githubUrl,
    slackUrl: projectToEdit.slackUrl,
    googleDriveUrl: projectToEdit.googleDriveUrl,
    // hflaWebsiteUrl: projectToEdit.name,
  });

  const [formData, setFormData] = useState({
    ...originalProjectData
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
          .map((item) => ({...item, ...readableEvent(item), raw: item}))
          .reverse() // sorts most recent events first
      );
    }
  }, [projectToEdit, regularEvents, setRegularEventsState]);

  // Form inputs.
  const simpleInputs = [
    {
      label: 'Project Name',
      name: 'name',
      type: 'text',
      value: projectToEdit.name,
    },
    {
      label: 'Project Description',
      name: 'description',
      type: 'textarea',
      value: projectToEdit.description,
    },
    {
      label: 'Location',
      name: 'location',
      type: 'text',
      value: projectToEdit.location,
    },
    // Leaving incase we want to add this back in for updating projects
    // {
    //   label: 'GitHub Identifier',
    //   name: 'githubIdentifier',
    //   type: 'text',
    //   placeholder: 'Enter GitHub identifier',
    // },
    {
      label: 'GitHub URL',
      name: 'githubUrl',
      type: 'text',
      value: projectToEdit.githubUrl,
    },
    {
      label: 'Slack Channel Link',
      name: 'slackUrl',
      type: 'text',
      value: projectToEdit.slackUrl,
    },
    {
      label: 'Google Drive URL',
      name: 'googleDriveUrl',
      type: 'text',
      value: projectToEdit.googleDriveUrl,
    },
    // Leaving incase we want to add this back in for updating projects
    // {
    //   label: 'HFLA Website URL',
    //   name: 'hflaWebsiteUrl',
    //   type: 'text',
    //   value: projectToEdit.hflaWebsiteUrl,
    // },
  ];

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

  // Updates state of formData onChange of any form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
  };

  const revertToOriginal = () => {
    setFormData(originalProjectData);
  }

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
        arr={simpleInputs}
        formData={formData}
        projectToEdit={projectToEdit}
        handleChange={handleChange}
        isEdit={true}
        revertToOriginal={revertToOriginal}
        setOriginalProjectData={setOriginalProjectData}
      />
      <Box sx={{ bgcolor: '#F5F5F5', my: 2 }}>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>
              Recurring Events
            </Typography>
          </Box>
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
        </Box>
        <Divider sx={{ borderColor: 'rgba(0,0,0,1)' }} />
        <Box sx={{ py: 2, px: 4 }}>
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
          {/* <div className="display-events"></div> */}
        </Box>
      </Box>

      <Box sx={{ bgcolor: '#F5F5F5', my: 3 }}>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>
              Manually Edit Events Checkin
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'rgba(0,0,0,1)' }} />
        <Box sx={{ py: 2, px: 4 }}>
          <div className="event-list">
            <h2 className="event-alert">{eventAlert}</h2>
            <ul>
              {regularEventsState.map((event, index) => (
                
                // eslint-dis able-next-line no-underscore-dangle
                <RegularEvent event={event} key={event._id} updateRegularEvent={updateRegularEvent} />
              ))}              
            </ul>
          </div>
        </Box>
        
      </Box>
    </Box>
  );
};

function RegularEvent({event, updateRegularEvent}) {
  return (
    <li key={`${event.event_id}`}>
      <button type="button" onClick={async () => updateRegularEvent({checkInReady: !event.checkInReady}, event.event_id)}>
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
