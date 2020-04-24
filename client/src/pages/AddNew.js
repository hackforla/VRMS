import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "../sass/AddNew.scss";

import { HeaderBarTextOnly } from "../components/Header";
import {
  Label,
  Input,
  Select,
  Option,
  OptionPlaceholder,
  SecondaryButton,
  AuxiliaryButton,
} from "../components/Form";
import { ErrorContainer } from "../components/ErrorContainer";
// import AddCircle from '@material-ui/core/AddCircle';
// import RemoveCircle from '@material-ui/core/RemoveCircle';

import useAuth from "../hooks/useAuth";
import moment from "moment";
import "moment-recur";

const AddNew = (props) => {
  // State Data
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [hacknightLocation, setHacknightLocation] = useState("");
  const todayFormatted = moment(new Date()).format("YYYY[-]MM[-]DD");
  const [eventDates, setEventDates] = useState([todayFormatted]);
  const [eventStartTime, setEventStartTime] = useState("19:00");
  const [eventEndTime, setEventEndTime] = useState("21:00");
  const [eventCity, setEventCity] = useState("");
  const [eventState, setEventState] = useState("");
  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const auth = useAuth();

  // Form Data to Fill Drop-downs
  const eventTypes = ["Hacknight", "Onboarding", "Happy Hour", "Team Meeting"];
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

  // allows adding and removal of event dates
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

  const submitForm = (newEventData, currEventIndex, finalEventIndex) => {
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
      .then((res) => {
        // if only one event was submitted, redirect to specific event page
        if (finalEventIndex === 0) {
          return <Redirect to={`/event/${res.id}`} />;
        }
        // if multiple events were submitted, after all are submitted, redirect to events page
        else if (currEventIndex === finalEventIndex) {
          return <Redirect to="/events" />;
        }
      })
      .catch((err) => console.log(err));
  };

  const createNewEvents = (event) => {
    event.preventDefault();

    const newEventsData = eventDates.map((eventDate) => {
      // const formattedDate = ****EDIT ME
      // const formattedEndDate = ****EDIT ME
      // const hours = formattedEndDate.diff(formattedDate);

      return {
        name: eventName,
        location: {
          city: eventCity,
          state: eventState,
          country: "USA",
        },
        hacknight: hacknightLocation,
        eventType,
        // date: formattedDate,
        // hours,
        // owner:  ****EDIT ME
      };
    });

    try {
      setIsSubmitting(true);

      newEventsData.forEach((index, newEventData) => {
        if (
          eventName === "" ||
          eventType === "" ||
          (eventType === "hacknight" && hacknightLocation === "") ||
          eventCity === "" ||
          eventState === ""
        ) {
          setIsError(true);
          setErrorMessage("Please don't leave any fields blank");
          throw new Error();
        }

        submitForm(newEventData, index, newEventsData.length - 1);
      });

      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  return (
    // auth && auth.user ? (
    <div className="flex-container">
      <div className="addnew">
        <HeaderBarTextOnly>Add New {props.match.params.item}</HeaderBarTextOnly>

        {props.match.params.item === "event" && (
          <div className="addnewevent">
            <form onSubmit={(event) => createNewEvents(event)}>
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
                  onChange={(event) => {
                    setEventType(event.target.value);
                    event !== "hacknight" && setHacknightLocation("");
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

              {/* to do: figure out how to add item to dom here */}
              <div className="event-div-container event-date-container">
                <Label htmlFor="event-date">Event Date</Label>
                {eventDates.map((eventDate, index) => {
                  return (
                    <div key={index}>
                      <Input
                        type="date"
                        id="event-date"
                        // className="small inline"
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

              {isError && <ErrorContainer>{errorMessage}</ErrorContainer>}
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
    // ) : (
    //   <Redirect to="/login" />
    // )
  );
};

export default AddNew;
