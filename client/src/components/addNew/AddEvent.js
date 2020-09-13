import React, { useState, useContext } from 'react';
import moment from 'moment';
import 'moment-recur';
import {
	Label,
	Input,
	Textarea,
	Select,
	Option,
	OptionPlaceholder,
	SecondaryButton,
	AuxiliaryButton,
} from '../Form';
import { ErrorContainer } from "../ErrorContainer";
import { UserContext } from '../../context/userContext';

const AddEvent = (props) => {
  const { projects, error, setError, setRedirectLink } = props;
  const user = useContext(UserContext).user;

  // State Data
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [projectIndex, setProjectIndex] = useState(null);
  const [hacknightLocation, setHacknightLocation] = useState('');
  const [eventOccursWeekly, setEventOccursWeekly] = useState(false);
  const todayFormatted = moment(new Date()).format('YYYY[-]MM[-]DD');
  const [eventDates, setEventDates] = useState([todayFormatted]);
  const [eventStartTime, setEventStartTime] = useState('19:00');
  const [eventEndTime, setEventEndTime] = useState('21:00');
  const [eventIsRemote, setEventIsRemote] = useState(false);
  const [eventCity, setEventCity] = useState('');
  const [eventState, setEventState] = useState('CA');
  const [videoConferenceLink, setVideoConferenceLink] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [errorStatus, setErrorStatus] = useState(null);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Data to Fill Drop-downs
  const eventTypes = [
    'Hacknight',
    'Conference',
    'Summit',
    'Team Meeting',
    'Onboarding',
    'Happy Hour',
  ];
  const hacknightLocations = [
    {
      location: 'DTLA',
      city: 'Los Angeles',
    },
    {
      location: 'Westside',
      city: 'Santa Monica',
    },
    {
      location: 'South LA',
      city: 'Inglewood',
    },
    {
      location: 'Online',
      city: '',
    },
  ];
  const cities = ['Los Angeles', 'Santa Monica', 'Inglewood'];
  const states = [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
  ];

  // allows adding and removal of dates for event
  const editEventDates = (index, action) => {
    const currEventDates = eventDates.map((date) => date);

    if (action === 'add') {
      const oneWeekFromCurrDate = moment(eventDates[index]).add(7, 'days');
      currEventDates.splice(
        index + 1,
        0,
        oneWeekFromCurrDate.format('YYYY[-]MM[-]DD')
      );
      setEventDates(currEventDates);
    } else if (action === 'remove') {
      currEventDates.splice(index, 1);
      setEventDates(currEventDates);
    }
  };

  // makes changes for a remote event
  const setStateForRemote = (boolean) => {
    setEventIsRemote(boolean);

    if (eventType === 'Hacknight' && boolean) {
      setHacknightLocation('Online');
    } else {
      setHacknightLocation('');
    }
  };

  const postSingleEvent = (eventObj) => {
    fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventObj),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        } else {
          return res.json();
        }
      })
      .catch((err) => {
        setErrorStatus(err);
      });
  };

  const postRecurringEvent = async (eventObj) => {
    console.log('postRecurring running');
    const ObjToSend = JSON.stringify(eventObj);
    console.log(ObjToSend);
    try {
      await fetch('/api/recurringevents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: ObjToSend,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          setErrorStatus(err);
        });
    } catch (error) {
      console.log(error);
    }

    console.log('postRecurring ran');
  };

  // const createEventObj = (eventDate, ownerId) => {
  const createEventObj = (eventDate) => {
    const ISODate = moment(eventDate).toISOString();
    const ISOStartDate = moment(eventDate + ' ' + eventStartTime).toISOString();
    const ISOEndDate = moment(eventDate + ' ' + eventEndTime).toISOString();
    const hours = moment(ISOEndDate).diff(ISOStartDate, 'hours');
    console.log('try createEventObj');
    const name = eventName.toString();

    const createdEventObj = {
      name: name,
      location: {
        city: eventCity,
        state: eventState,
        country: 'USA',
      },
      hacknight: hacknightLocation,
      eventType: eventType,
      description: eventDescription,
      project: projects
        ? {
            projectId: projects[projectIndex]._id,
            name: projects[projectIndex].name,
            videoConferenceLink,
            githubIdentifier: projects[projectIndex].githubIdentifier,
            hflaWebsiteUrl: projects[projectIndex].hflaWebsiteUrl,
            githubUrl: projects[projectIndex].githubUrl,
          }
        : {
            projectId: '123456',
            videoConferenceLink,
          },
      date: ISODate,
      startTime: ISOStartDate,
      endTime: ISOEndDate,
      hours: hours,
      // owner: {
      // 	ownerId,
      // },
    };

    console.log('created event object: ', createdEventObj);

    return createdEventObj;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setIsSubmitting(true);
    console.log('handleSubmit ran');

    if (
      user.email === '' ||
      eventName === '' ||
      eventType === '' ||
      (eventType === 'Hacknight' && hacknightLocation === '') ||
      (eventIsRemote
        ? !videoConferenceLink
        : eventCity === '' || eventState === '')
    ) {
      setErrorStatus({ message: "Please don't leave any fields blank" });
      setIsSubmitting(false);
      return;
    }

    if (eventType === 'Hacknight' && projects && projectIndex === null) {
      setErrorStatus({ message: 'Please select a project' });
      setIsSubmitting(false);
      return;
    }

    try {
      // const ownerId = await getUserId(user.email);

      // Handle Recurring Event
      if (eventOccursWeekly) {
        console.log('Trying to run handleSubmit');
        // const evObj = createEventObj(eventDates[0], ownerId);
        const evObj = createEventObj(eventDates[0]);

        await postRecurringEvent(evObj)
          .then(() => setIsSubmitting(false))
          .then(() => setRedirectLink('/events'))
          .catch((err) => setErrorStatus(err));

        console.log('Done running handleSubmit');
        // Handle Regular Event(s)
      } else {
        const eventsObjects = [];

        eventDates.forEach((eventDate) => {
          // const evObj = createEventObj(eventDate, ownerId);
          const evObj = createEventObj(eventDate);
          eventsObjects.push(evObj);
        });

        await Promise.all(
          eventsObjects.map(async (event) => {
            return await postSingleEvent(event);
          })
        )
          .then(() => setIsSubmitting(false))
          .then(() => setRedirectLink('/events'))
          .catch((err) => setErrorStatus(err));
      }
    } catch (error) {
      setErrorStatus(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="addnewevent">
      <form
        onSubmit={(ev) => handleSubmit(ev)}
        onClick={() => {
          error && setError('');
        }}
      >
        <div className="event-div-container">
          <Label htmlFor="event-name">Event Name</Label>
          <Input
            type="text"
            id="event-name"
            placeholder="Event Name"
            value={eventName}
            onChange={(event) => setEventName(event.target.value)}
          ></Input>
        </div>

        {/* To do: configure nested dropdown */}
        <div className="event-div-container">
          <Label htmlFor="event-type">Event Type</Label>
          <Select
            id="event-type"
            className="small"
            value={eventType}
            onChange={(ev) => {
              const evType = ev.target.value;
              setEventType(evType);
              evType !== 'Hacknight' && setHacknightLocation('');
            }}
          >
            <OptionPlaceholder>Select Type</OptionPlaceholder>
            {eventTypes.map((eventType, index) => (
              <Option value={eventType} key={index}>
                {eventType}
              </Option>
            ))}
          </Select>
          {eventType === 'Hacknight' &&
            hacknightLocations.map((obj, index) => (
              <Label htmlFor={obj.location} isRadioParent="true" key={index}>
                <Input
                  type="radio"
                  name={obj.location}
                  checked={obj.location === hacknightLocation ? true : false}
                  onChange={() => {
                    setHacknightLocation(obj.location);
                    setEventCity(obj.city);
                    obj.location === 'Online'
                      ? setEventIsRemote(true)
                      : setEventIsRemote(false);
                  }}
                  id={obj.location}
                  value={hacknightLocation === obj.location ? true : false}
                />
                {obj.location}
              </Label>
            ))}
        </div>

        <div className="event-div-container">
          <Label htmlFor="event-recurring">Occurs Weekly</Label>
          <Label htmlFor="occurs-weekly" isRadioParent="true">
            <Input
              type="radio"
              onChange={() => setEventOccursWeekly(true)}
              id="occurs-weekly"
              checked={eventOccursWeekly}
            />
            Yes
          </Label>
          <Label htmlFor="doesnt-occur-weekly" isRadioParent="true">
            <Input
              type="radio"
              name="doesnt-occur-weekly"
              onChange={() => setEventOccursWeekly(false)}
              id="doesnt-occur-weekly"
              checked={!eventOccursWeekly}
            />
            No
          </Label>
        </div>

        {eventType === 'Hacknight' && (
          <div className="event-div-container">
            <Label htmlFor="project-name">Project</Label>
            <Select
              id="project-name"
              className="small"
              value={
                !!projects[projectIndex] ? projects[projectIndex].name : ''
              }
              onChange={(ev) => {
                const index = ev.target.value;
                setProjectIndex(index);
              }}
            >
              <OptionPlaceholder>Select Project</OptionPlaceholder>
              {projects.map((prj, index) => (
                <Option value={index} key={index}>
                  {prj.name}
                </Option>
              ))}
            </Select>
          </div>
        )}

        <div className="event-div-container div-full-width">
          <Label htmlFor="event-date">Event Date</Label>
          {eventDates.map((eventDate, index) => {
            return (
              <div key={index}>
                <Input
                  type="date"
                  id="event-date"
                  size="small"
                  value={eventDate}
                  onChange={(event) => {
                    const newDate = event.target.value;
                    const currEventDates = eventDates.map((date) => date);
                    currEventDates[index] = newDate;
                    setEventDates(currEventDates);
                  }}
                ></Input>
                {!eventOccursWeekly && (
                  <>
                    <AuxiliaryButton
                      onClick={() => editEventDates(index, 'add')}
                      className="inline"
                    >
                      +
                    </AuxiliaryButton>
                    {index !== 0 && (
                      <AuxiliaryButton
                        onClick={() => editEventDates(index, 'remove')}
                        className="inline"
                      >
                        -
                      </AuxiliaryButton>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="event-div-container">
          <Label htmlFor="start-time">Start Time</Label>
          <Input
            type="time"
            id="start-time"
            value={eventStartTime}
            onChange={(event) => setEventStartTime(event.target.value)}
          ></Input>
        </div>

        <div className="event-div-container">
          <Label htmlFor="end-time">End Time</Label>
          <Input
            type="time"
            id="end-time"
            value={eventEndTime}
            onChange={(event) => setEventEndTime(event.target.value)}
          ></Input>
        </div>

        {eventType !== 'Hacknight' && (
          <div className="event-div-container div-full-width">
            <Label>Hosted Remotely?</Label>
            <Label htmlFor="true">
              <Input
                type="radio"
                id="true"
                checked={eventIsRemote}
                onChange={() => setStateForRemote(true)}
                disabled={hacknightLocation === 'Online'}
              />
              Yes
            </Label>
            <Label htmlFor="false">
              <Input
                type="radio"
                id="false"
                checked={!eventIsRemote}
                onChange={() => setStateForRemote(false)}
                disabled={hacknightLocation === 'Online'}
              />
              No
            </Label>
          </div>
        )}

        {!eventIsRemote ? (
          <>
            <div className="event-div-container">
              <Label htmlFor="city">City</Label>
              <Select
                type="text"
                id="city"
                className="small"
                value={eventCity}
                // restricts city to always match hacknight
                onChange={
                  hacknightLocation
                    ? null
                    : (event) => setEventCity(event.target.value)
                }
                disabled={eventType === 'Hacknight' ? true : false}
              >
                <OptionPlaceholder>Select A City</OptionPlaceholder>
                {cities.map((city, index) => (
                  <Option key={index} value={city}>
                    {city}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="event-div-container">
              <Label htmlFor="state">State</Label>
              <Select
                type="text"
                id="state"
                className="small"
                value={eventState}
                onChange={(event) => setEventState(event.target.value)}
              >
                <OptionPlaceholder>Select A State</OptionPlaceholder>
                {states.map((state, index) => (
                  <Option key={index} value={state}>
                    {state}
                  </Option>
                ))}
              </Select>
            </div>
          </>
        ) : (
          <div className="event-div-container div-full-width">
            <Label>Video Conference Link</Label>
            <Input
              value={videoConferenceLink}
              onChange={(e) => setVideoConferenceLink(e.target.value)}
              size="large"
              placeholder="https://us02.web.zoom.us/j/123456789"
            />
          </div>
        )}

        <div className="event-div-container div-full-width">
          <Label>Description</Label>
          <Textarea onChange={(ev) => setEventDescription(ev.target.value)} />
        </div>

        {errorStatus && <ErrorContainer>{errorStatus.message}</ErrorContainer>}
        <SecondaryButton
          disabled={isSubmitting}
          className="center"
          type="submit"
        >
          Save
        </SecondaryButton>
      </form>
    </div>
  );
};

export default AddEvent;
