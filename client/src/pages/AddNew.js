import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import "../sass/AddNew.scss";

import { HeaderBarTextOnly } from "../components/Header";
import {
  Label,
  Input,
  Textarea,
  Select,
  Option,
  OptionPlaceholder,
  SecondaryButton,
  AuxiliaryButton,
} from "../components/Form";
// import { ErrorContainer } from "../components/ErrorContainer";

import { UserProvider, UserContext } from '../context/userContext';
import useAuth from "../hooks/useAuth";
import moment from "moment";
import "moment-recur";

const AddNew = (props) => {
  // State Data
  const [eventCreator, setEventCreator] = useState({});
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [hacknightLocation, setHacknightLocation] = useState("");
  const todayFormatted = moment(new Date()).format("YYYY[-]MM[-]DD");
  const [eventDates, setEventDates] = useState([todayFormatted]);
  const [eventStartTime, setEventStartTime] = useState("19:00");
  const [eventEndTime, setEventEndTime] = useState("21:00");
  const [eventIsRemote, setEventIsRemote] = useState(false);
  const [eventCity, setEventCity] = useState("");
  const [eventState, setEventState] = useState("CA");
  const [videoConferenceLink, setVideoConferenceLink] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const auth = useAuth();

  // Form Data to Fill Drop-downs
  const eventTypes = ["hacknight", "onboarding", "happy Hour", "team meeting"]; 
  const hacknightLocations = [
    {
      location: "DTLA",
      city: "Los Angeles",
    },
    {
      location: "Westside",
      city: "Santa Monica",
    },
    {
      location: "South LA",
      city: "Inglewood",
    },
    {
      location: "Online",
      city: "",
    },
  ];
  const cities = ["Los Angeles", "Santa Monica", "Inglewood"];
  const states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  // allows adding and removal of dates for event
  const editEventDates = (index, action) => {
    const currEventDates = eventDates.map((date) => date);

    if (action === "add") {
      const oneWeekFromCurrDate = moment(eventDates[index]).add(7, "days");
      currEventDates.splice(
        index + 1,
        0,
        oneWeekFromCurrDate.format("YYYY[-]MM[-]DD")
      );
      setEventDates(currEventDates);
    } else if (action === "remove") {
      currEventDates.splice(index, 1);
      setEventDates(currEventDates);
    }
  };

  // makes changes for a remote event
  const setStateForRemote = (boolean) => {
    setEventIsRemote(boolean);
    
    if (eventType === 'hacknight' && boolean) {
      setHacknightLocation('Online');
    } else {
      setHacknightLocation('');
    }
  }
  
  const submitForm = (newEventData) => {
    fetch("/api/events", {
      method: "POST",
      body: JSON.stringify(newEventData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        throw new Error(res.statusText);
      })
      .catch((err) => {
        setError(err)
      });
  };

  const getUserId = (email) => {
    return fetch('/api/checkuser', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        
        throw new Error(error.statusText);
      })
      .then(user => {
        return user._id;
      })
      .catch(() => {
        setError(error.message);
        setIsSubmitting(false);
      });
  }

  const createNewEvents = async (ev) => {
    ev.preventDefault();
    setIsSubmitting(true);

    if (
      eventCreator === {} ||
      eventName === "" ||
      eventType === "" || 
      (eventType === "hacknight" && hacknightLocation === "") || 
      (eventIsRemote ? (
          !videoConferenceLink
        ) : (
          eventCity === "" ||
          eventState === ""
        )
      )
    ) {
      setError("Please don't leave any fields blank");
      setIsSubmitting(false);
      return;
    };

 

    try {
      const ownerId = await getUserId(eventCreator.email);

      const newEventsData = eventDates.map((eventDate) => {
        const ISODate = moment(eventDate).toISOString();      
        const ISOStartDate = moment(eventDate + ' ' + eventStartTime).toISOString();
        const ISOEndDate = moment(eventDate + ' ' + eventEndTime).toISOString();
        const hours = moment(ISOEndDate).diff(ISOStartDate, 'hours');
  
        return ({
          name: eventName,
          location: {
            city: eventCity,
            state: eventState,
            country: 'USA'
          },
          hacknight: hacknightLocation,
          eventType,
          description: eventDescription,
          // projectId
          date: ISODate,
          startTime: ISOStartDate,
          endTime: ISOEndDate,
          hours,
          createdDate: new Date().toISOString(),
          owner: {
            ownerId
          },
          videoConferenceLink,
          // githubIdentifier: EDIT ME
        });
      }); 
  

      await Promise.all(
        newEventsData.forEach(async (newEventData) => {
          return await submitForm(newEventData);
        })
      )
        .then(() => setIsSubmitting(false))
        .then(() => <Redirect to='/events' />);
    } catch (error) {
      setError(error.message);
      setIsSubmitting(false);
    }
  };  
  return (
    auth && auth.user ? (
    <div className="flex-container">
      <div className="addnew">
        <UserProvider>
          <UserContext.Consumer>
            {({user}) => setEventCreator(user)}
          </UserContext.Consumer>
        </UserProvider>
        <HeaderBarTextOnly>Add New {props.match.params.item}</HeaderBarTextOnly> 

        {props.match.params.item === "event" && (
          <div className="addnewevent">
            <form onSubmit={(ev) => createNewEvents(ev)} onClick={() => {error && setError('')}}>
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
                    evType !== "hacknight" && setHacknightLocation("");
                  }}
                >
                  <OptionPlaceholder>Event Type</OptionPlaceholder>
                  {eventTypes.map((eventType, index) => (
                    <Option value={eventType} key={index}>
                      {eventType}
                    </Option>
                  ))}
                </Select>
                {eventType === "hacknight" &&
                  hacknightLocations.map((obj) => (
                    <Label htmlFor={obj.location} isRadioParent="true">
                      <Input
                        type="radio"
                        onClick={() => {
                          setHacknightLocation(obj.location);
                          setEventCity(obj.city);
                          obj.location === 'Online' ? setEventIsRemote(true) : setEventIsRemote(false);
                        }}
                        id={obj.location}
                        checked={
                          hacknightLocation === obj.location ? true : false
                        }
                      />
                      {obj.location}
                    </Label>
                  ))}
              </div>

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
                      <AuxiliaryButton
                        onClick={() => editEventDates(index, "add")}
                        className="inline"
                      >
                        +
                      </AuxiliaryButton>
                      {index !== 0 && (
                        <AuxiliaryButton
                          onClick={() => editEventDates(index, "remove")}
                          className="inline"
                        >
                          -
                        </AuxiliaryButton>
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
              
              <div className="event-div-container div-full-width">
                <Label>Hosted Remotely?</Label>
                <Label htmlFor='true'  onClick={() => hacknightLocation !== 'Online' && setStateForRemote(true)}>
                <Input type='radio' name='true'
                  checked={eventIsRemote} 
                  onChange={() => setStateForRemote(true)}
                  disabled={hacknightLocation === 'Online'}
                  /> 
                Yes
                </Label>
                <Label htmlFor='false' onClick={() => {hacknightLocation !== 'Online' && setStateForRemote(false)}} >
                <Input type='radio' name='false'
                  checked={!eventIsRemote} 
                  onChange={() => setStateForRemote(false)}
                  disabled={hacknightLocation === 'Online'}/>
                No 
                </Label>
              </div>

              {
                !eventIsRemote ? (
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
                      disabled={eventType === "hacknight" ? true : false}
                    >
                      <OptionPlaceholder>City</OptionPlaceholder>
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
                      <OptionPlaceholder>State</OptionPlaceholder>
                      {states.map((state, index) => (
                        <Option key={index} value={state}>
                          {state}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  </>
                ) : (
                  <div className='event-div-container div-full-width'>
                    <Label>Video Conference Link</Label>
                    <Input onChange={setVideoConferenceLink} size='large' placeholder='https://us02.web.zoom.us/j/123456789'/>
                  </div>
                )
              }

              <div className="event-div-container div-full-width">
                <Label>Description</Label>
                <Textarea onChange={ev => setEventDescription(ev.target.value)}/>
              </div>


              {/* {error && <ErrorContainer>{error}</ErrorContainer>} */}
              <SecondaryButton
                {...(isSubmitting && "disabled")}
                className="center"
                type="submit"
              >
                Save
              </SecondaryButton>
            </form>
          </div>
        )}
      </div>
    </div>
    ) : (
      <Redirect to="/login" />
    )
  );
};

export default AddNew;
