import React, { useState, useEffect, useCallback } from 'react';
import EditMeetingTimes from './editMeetingTimes';
import CreateNewEvent from './createNewEvent';
import readableEvent from './utilities/readableEvent';
import ProjectForm from '../ProjectForm';
import { simpleInputs, additionalInputsForEdit } from '../data';
import TitledBox from '../parts/boxes/TitledBox';

import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '../../svg/Icon_Edit.svg?react';
import PlusIcon from '../../svg/PlusIcon.svg?react';

import {
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';

// --- Styled Components: Centralized & Reusable UI Elements ---
// Leverages MUI's `styled` utility for cleaner, component-specific styles
// enhancing maintainability and adherence to design principles

// StyledListItem: Base style for each event row
// Padding is applied to the clickable `ListItemButton` for full-width hover effect
const StyledListItem = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderBottom: `1px solid ${theme.palette.grey[200] || '#ecebed'}`,
  padding: 0,
}));

// StyledListItemButton: The clickable area for each event row
// Contains core text and hover styling for consistent UX
const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  padding: '8px 0',
  fontFamily:
    "'aliseoregular', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  textAlign: 'left',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: '#f2f2f2',
  },
}));

// DetailsText: Consistent typography for secondary event details
const DetailsText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '14px',
  lineHeight: '24px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: 'block',
}));




// DescriptionText: Specific typography for the event description line
const DescriptionText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '14px',
  lineHeight: '24px',
  color: '#5c5c5c',
  height: '24px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: 'block',
}));

/**
 * EditProject: A component for managing and editing project details
 * @param {Object} projectToEdit - The project to be edited
 * @param {Array} recurringEvents - All recurring events associated with the current project
 * @param {Function} createNewRecurringEvent - Function to create a new recurring event
 * @param {Function} deleteRecurringEvent - Function to delete a recurring event
 * @param {Function} updateRecurringEvent - Function to update a recurring event
 * @param {Array} regularEvents - All regular events associated with the current project
 * @param {Function} updateRegularEvent - Function to update a regular event
 * @returns {ReactElement} - A component with the project form, recurring events, and regular
 * events sections
 */
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
    // Note: 'partners', 'managedByUsers', 'projectStatus', and 'googleDriveId' fields
    // are commented out as per recent PRs (#1577, #1584) to streamline project data
  });

  // eslint-disable-next-line no-unused-vars

  const [rEvents, setREvents] = useState([]);
  const [regularEventsState, setRegularEventsState] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCreateNew, setIsCreateNew] = useState(false);

  // State for displaying event-related alerts (e.g., success messages)
  const [eventAlert, setEventAlert] = useState(null);

  // `buttonKey`: Manages the key for the "Add New Event" button
  // Incrementing this key forces the button to re-mount, fixing a stuck ripple
  // effect when the CreateNewEvent modal is closed via the Escape key
  const [buttonKey, setButtonKey] = useState(0);

  // --- Ripple Effect Fix for List Items (Scalable Solution) ---
  // These states prevent stuck ripple/hover effects on ListItemButtons
  // when associated modals close via the Escape key, leveraging React's `key` prop
  // for targeted component re-mounting.

  // `lastOpenedEventId`: Tracks the ID of the specific event whose modal was last opened
  const [lastOpenedEventId, setLastOpenedEventId] = useState(null);

  // `forceRemountEventId`: Signals which specific ListItemButton needs to be re-mounted
  // Changing its key value forces a full component reset for that item only
  const [forceRemountEventId, setForceRemountEventId] = useState(null);
  // --- End Ripple Effect Fix States ---

  // `handleSelectEvent`: Opens the Edit Meeting Times modal.
  // It captures the clicked event's ID to track which list item should be reset
  // if the modal closes via the Escape key.
  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    // Determine the correct unique ID for the selected event
    const idToTrack = event._id || event.event_id;
    setLastOpenedEventId(idToTrack);
    setForceRemountEventId(null); // Clear any pending re-mounts for other items
  }, []);

  // `handleCloseEditMeetingModal`: Closes the Edit Meeting Times modal.
  // If the modal was closed by the Escape key, it flags the corresponding
  // `ListItemButton` for re-mounting to clear any stuck visual states.
  const handleCloseEditMeetingModal = useCallback(
    (event, reason) => {
      setSelectedEvent(null);
      if (reason === 'escapeKeyDown' && lastOpenedEventId) {
        setForceRemountEventId(lastOpenedEventId);
      }
      setLastOpenedEventId(null);
    },
    [lastOpenedEventId]
  );

  // `handleOpenCreateNewModal`: Sets the state to open the Create New Event modal
  const handleOpenCreateNewModal = useCallback(() => {
    setIsCreateNew(true);
  }, []);

  // `handleCloseCreateNewModal`: Closes the Create New Event modal.
  // If closed by Escape key, it triggers a `buttonKey` change for the "Add New Event"
  // button, forcing its re-mount to clear any stuck ripple effect.
  const handleCloseCreateNewModal = useCallback((event, reason) => {
    setIsCreateNew(false);
    if (reason === 'escapeKeyDown') {
      setButtonKey((prevKey) => prevKey + 1);
    }
  }, []);

  // Populates `regularEventsState` by filtering and mapping regular events
  // associated with the current project, sorting them by most recent first.
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

  // Populates `rEvents` (recurring events) by filtering and mapping them
  // for the current project, sorting by day of the week.
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
      {/* Dialog for editing recurring meeting times */}
      <Dialog
        open={!!selectedEvent}
        onClose={handleCloseEditMeetingModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            minHeight: '64px',
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseEditMeetingModal}
            sx={{
              color: 'black',
              fontWeight: 'bold',
              zIndex: 1301,
              flexShrink: 0,
              flex: 'none',
              width: '40px',
              height: '40px',
              padding: '0',
              overflow: 'hidden',
              '& .MuiSvgIcon-root': {
                fontSize: '1.75rem',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2 }}>
          <EditMeetingTimes
            projectToEdit={projectToEdit}
            selectedEvent={selectedEvent}
            setEventAlert={setEventAlert}
            setSelectedEvent={setSelectedEvent}
            deleteRecurringEvent={deleteRecurringEvent}
            updateRecurringEvent={updateRecurringEvent}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog for creating new events */}
      <Dialog
        open={isCreateNew}
        onClose={handleCloseCreateNewModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            minHeight: '64px',
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseCreateNewModal}
            size="large"
            sx={{
              color: 'black',
              zIndex: 1301,
              flexShrink: 0,
              flex: 'none',
              width: '40px',
              height: '40px',
              padding: '0',
              overflow: 'hidden',
              '& .MuiSvgIcon-root': { fontSize: '1.75rem' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2 }}>
          <CreateNewEvent
            createNewRecurringEvent={createNewRecurringEvent}
            projectToEdit={projectToEdit}
            projectID={projectToEdit._id}
            setEventAlert={setEventAlert}
            setIsCreateNew={setIsCreateNew}
          />
        </DialogContent>
      </Dialog>
      {/* Main project form for editing project details */}
      <ProjectForm
        arr={[...simpleInputs, ...additionalInputsForEdit]}
        formData={formData}
        projectToEdit={projectToEdit}
        isEdit={true}
        setFormData={setFormData}
      />

      {/* Section for displaying and managing recurring events */}
      <TitledBox
        title="Recurring Events"
        badge={
          // Key prop forces component re-render when `buttonKey` changes,
          // clearing any stuck ripple animation from the previous interaction.
          <Button
            key={buttonKey}
            onClick={handleOpenCreateNewModal}
            startIcon={<PlusIcon />}
            sx={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'black',
              textTransform: 'none',
              '&:hover': {
                color: 'error.main',
              },
              maxWidth: '138px',
              width: '138px',
              justifyContent: 'center',
            }}
          >
            Add New Event
          </Button>
        }
      >
        <Box
          sx={{
            marginBottom: '40px',
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              width: '190px',
              padding: '7px 18px 10px',
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontSize: '18px',
              lineHeight: '24px',
              color: '#000000',
              backgroundColor: '#f2f2f2',
            }}
          >
            {eventAlert}
          </Typography>
          <List sx={{ paddingTop: '4px' }}>
            {rEvents.map((event) => {
              // Determine the correct unique ID for the current recurring event
              const currentEventId = event._id || event.event_id;

              return (
                // eslint-disable-next-line no-underscore-dangle
                <StyledListItem
                  key={
                    forceRemountEventId === currentEventId // Compare against the correctly identified ID
                      ? `${currentEventId}_${Date.now()}` // Appends a unique timestamp for re-mounts
                      : currentEventId // Uses stable ID for normal renders
                  }
                >
                  <StyledListItemButton
                    onClick={() => handleSelectEvent(event)}
                  >
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <ListItemText
                        primary={event.name}
                        primaryTypographyProps={{
                          fontWeight: 'bold',
                        }}
                      />
                      <DetailsText component="span">
                        {' '}
                        {`${event.dayOfTheWeek}, ${event.startTime} - ${event.endTime}; ${event.eventType}`}
                      </DetailsText>
                      <DescriptionText component="span">
                        {' '}
                        {`${event.description}`}
                      </DescriptionText>
                    </Box>
                    <Box sx={{ flexShrink: 0, ml: 1 }}>
                      {' '}
                      <EditIcon style={{ cursor: 'pointer' }} />{' '}
                    </Box>
                  </StyledListItemButton>
                </StyledListItem>
              );
            })}
          </List>
        </Box>
      </TitledBox>

      {/* Section for manually editing check-ins for regular (non-recurring) events */}
      <TitledBox title="Manually Edit Events Checkin">
        <Box sx={{ marginBottom: '40px' }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              width: '190px',
              padding: '7px 18px 10px',
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontSize: '18px',
              lineHeight: '24px',
              color: '#000000',
              backgroundColor: '#f2f2f2',
            }}
          >
            {eventAlert}
          </Typography>
          <List sx={{ paddingTop: '4px' }}>
            {regularEventsState.map((event) => (
              <RegularEvent
                event={event}
                key={
                  forceRemountEventId === event._id
                    ? `${event._id}_${Date.now()}` // Appends a unique timestamp for re-mounts
                    : event._id // Uses stable _id for normal renders
                }
                updateRegularEvent={updateRegularEvent}
                handleSelectEvent={handleSelectEvent} // Pass handler for modal opening.
              />
            ))}
          </List>
        </Box>
      </TitledBox>
    </Box>
  );
};

/**
 * RegularEvent: Displays a single regular event item within a list.
 * It's responsible for rendering event details and handling selection to open an edit modal.
 * @param {Object} event - The regular event object to display. Includes details like name, time, type, and check-in status.
 * @param {Function} updateRegularEvent - A function to call when a regular event needs to be updated. (Note: Not directly used in the provided JSX, but passed as a prop.)
 * @param {Function} handleSelectEvent - A callback function to invoke when the event item is clicked, typically to select it and open a corresponding edit modal.
 * @returns {ReactElement} - A list item component representing a single regular event, with clickable functionality.
 */
const RegularEvent = ({ event, updateRegularEvent, handleSelectEvent }) => {
  return (
    <StyledListItem>
      <StyledListItemButton onClick={() => handleSelectEvent(event)}>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <ListItemText
            primary={event.name}
            primaryTypographyProps={{
              fontWeight: 'bold',
            }}
          />
          <DetailsText component="span">
            {`${event.dayOfTheWeek}, ${event.startTime} - ${event.endTime}; ${event.eventType}`}
          </DetailsText>
          <DetailsText component="span">
            {`${new Date(event.raw.startTime).toLocaleDateString()}`}
          </DetailsText>
          <DetailsText component="span">
            Is this event available for check in now?:{' '}
            <Typography
              component="strong"
              sx={{ fontWeight: 'bold', display: 'inline' }}
            >{`${event.checkInReady ? 'Yes' : 'No'}`}</Typography>
          </DetailsText>
        </Box>
      </StyledListItemButton>
    </StyledListItem>
  );
};

export default EditProject;
