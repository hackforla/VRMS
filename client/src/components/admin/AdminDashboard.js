import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import "../../sass/Dashboard.scss";
import "./AdminDashboard.scss";

import UpcomingEvent from "../presentational/upcomingEvent";
import EventOverview from "./eventOverview";
import DonutChartContainer from "./donutChartContainer";
import Loading from "./donutChartLoading";

const AdminDashboard = (props) => {
  const auth = useAuth();
  const defaultChartType = "All Events";
  let uniqueEventTypes = new Set();
  let hackNightUniqueLocations = new Set();

  //STATE
  const [nextEvent, setNextEvent] = useState([]);
  const [isCheckInReady, setIsCheckInReady] = useState();
  const [volunteers, setVolunteers] = useState(null);
  const [allVolunteers, setAllVolunteers] = useState(null);

  const [chartTypes, setChartTypes] = useState(null);

  // Volunteers SignedIn By Event Type
  const [totalVolunteersByEventType, setVolunteersSignedInByEventType] = useState({});
  const [totalVolunteerHoursByEventType, setVolunteeredHoursByEventType] = useState({});
  const [totalVolunteerAvgHoursByEventType, setAvgHoursByEventType] = useState({});

  // Volunteers SignedIn By Hacknight Property
  const [totalVolunteersByHacknightProp, setVolunteersSignedInByHacknightProp] = useState({});
  const [totalVolunteerHoursByHacknightProp, setVolunteeredHoursByHacknightProp] = useState({});
  const [totalVolunteerAvgHoursByHacknightProp, setAvgHoursByHacknightProp] = useState({});

  // Volunteers To Chart
  const [totalVolunteers, setVolunteersToChart] = useState({});
  const [totalVolunteerHours, setVolunteeredHoursToChart] = useState({});
  const [totalVolunteerAvgHours, setAvgHoursToChart] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  async function getAndSetData() {
    try {
      setIsLoading(true);
      const checkIns = await fetch("/api/checkins");
      const checkInsJson = await checkIns.json();
      const events = await fetch("/api/events");
      const eventsJson = await events.json();

      processData(eventsJson, checkInsJson);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  function processData(allEvents, allCheckIns){
    let processedEvents = processEvents(allEvents);
    let usersByEvent = collectUsersByEvent(allCheckIns);
    prepareDataForCharts(processedEvents, usersByEvent);
  }

  function processEvents(allEvents) {
    let events = new Map();

    for (let event of allEvents){
      // Process legacy data with undefined 'hours' property because initially an event length was 3 hours
      if(!event.hours){
        event.hours = 3;
      }

      // Define unique event types and process events without 'eventType' property
      if(event.eventType){
        processEventTypes(event, 'eventType', uniqueEventTypes);
      } else {
        // Find events without 'eventType' property (30 events) and assign it
        event.eventType = 'Hacknight';
      }

      // Extract events with 'hacknight' property & find unique locations in it
      if(event.hacknight){
        processEventTypes(event, 'hacknight', hackNightUniqueLocations);
      }
      events.set(event._id, event);
    }
    createChartTypes();
    return events;
  }

  function processEventTypes(event, propName, uniqueTypes){
    const capitalize = (str, lower = false) =>
        (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
    let type = capitalize(event[propName], true);
    event[propName] = type;
    uniqueTypes.add(type);
  }

  function createChartTypes(){
    let chartTypes = {
      "All Events": "",
      "Hacknight Only": ""
    };
    setChartTypes(chartTypes);
  }

  function collectUsersByEvent(allCheckIns){
    let eventCollection = new Map();
    for(let checkIn of allCheckIns){
      if(eventCollection.has(checkIn.eventId)){
        eventCollection.get(checkIn.eventId).push(checkIn);
      } else{
        eventCollection.set(checkIn.eventId, [checkIn]);
      }
    }
    return eventCollection;
  }

  function prepareDataForCharts(events, users){
    // Data for 1 chart 'total volunteers'
    let totalVolunteersByEventType = extractVolunteersSignedInByProperty(events, users, uniqueEventTypes, 'eventType');
    setVolunteersSignedInByEventType(totalVolunteersByEventType);
    let totalVolunteersByHacknightProp = extractVolunteersSignedInByProperty(events, users, hackNightUniqueLocations, 'hacknight');
    setVolunteersSignedInByHacknightProp(totalVolunteersByHacknightProp);

    // Data for 2 chart 'total hours'
    let totalVolunteerHoursByEventType = findTotalVolunteerHours(events, users, uniqueEventTypes, 'eventType');
    setVolunteeredHoursByEventType(totalVolunteerHoursByEventType);
    let totalVolunteerHoursByHacknightProp = findTotalVolunteerHours(events, users, hackNightUniqueLocations, 'hacknight');
    setVolunteeredHoursByHacknightProp(totalVolunteerHoursByHacknightProp);

    //  Data for 3 chart 'total average hours'
    let totalVolunteerAvgHoursByEventType = findAverageVolunteerHours(
        totalVolunteersByEventType,
        totalVolunteerHoursByEventType,
        uniqueEventTypes);
    setAvgHoursByEventType(totalVolunteerAvgHoursByEventType);

    let totalVolunteerAvgHoursByHacknightProp = findAverageVolunteerHours(
        totalVolunteersByHacknightProp,
        totalVolunteerHoursByHacknightProp,
        hackNightUniqueLocations);
    setAvgHoursByHacknightProp(totalVolunteerAvgHoursByHacknightProp);

    // Display data by default for "All" chart type
    setVolunteersToChart(totalVolunteersByEventType);
    setVolunteeredHoursToChart(totalVolunteerHoursByEventType);
    setAvgHoursToChart(totalVolunteerAvgHoursByEventType);
  }

  function extractVolunteersSignedInByProperty(events, users, uniqueTypes, propName){
    let result = {};
    let type;

    uniqueTypes.forEach(el => result[el] = parseInt('0'));
    for (let eventId of users.keys()) {
      if(propName === 'eventType'){
        type = events.get(eventId).eventType;
        result[type] = users.get(eventId).length + result[type];
      }

      if(propName === 'hacknight' && typeof events.get(eventId).hacknight !== 'undefined'){
        type = events.get(eventId).hacknight;
        result[type] = users.get(eventId).length + result[type];
      }
    }
    return result;
  }

  function findTotalVolunteerHours(events, users, uniqueTypes, propName){
    let result = {};
    let type;
    uniqueTypes.forEach(el => result[el] = parseInt('0'));

    for (let eventId of users.keys()) {
      if(propName === 'eventType'){
        type = events.get(eventId).eventType;
        result[type] = result[type] + (events.get(eventId).hours * users.get(eventId).length);
      }

      if (propName === 'hacknight' && typeof events.get(eventId).hacknight !== 'undefined'){
        type = events.get(eventId).hacknight;
        result[type] = result[type] + (events.get(eventId).hours * users.get(eventId).length);
      }
    }
    return result;
  }

  function findAverageVolunteerHours(totalVolunteers, totalVolunteerHours, uniqueTypes){
    let result = {};
    uniqueTypes.forEach(el => result[el] = parseInt('0'));

    for(let eventType of uniqueTypes.keys()){
      let hours = totalVolunteerHours[eventType];
      let volunteers = totalVolunteers[eventType];
      let averageHours = (hours / volunteers);
      if(!Number.isInteger(averageHours)) averageHours = +averageHours.toFixed(2);
      volunteers > 0 ? result[eventType] = averageHours : result[eventType] = 0;
    }
    return result;
  }

  function setDonutCharts(valueFromSelect){
    // Display data depending on value from select
    if(valueFromSelect === defaultChartType){
      setVolunteersToChart(totalVolunteersByEventType);
      setVolunteeredHoursToChart(totalVolunteerHoursByEventType);
      setAvgHoursToChart(totalVolunteerAvgHoursByEventType);
    } else if (valueFromSelect === "Hacknight Only"){
      setVolunteersToChart(totalVolunteersByHacknightProp);
      setVolunteeredHoursToChart(totalVolunteerHoursByHacknightProp);
      setAvgHoursToChart(totalVolunteerAvgHoursByHacknightProp);
    }
  }

  async function getUsers() {
    const headerToSend = process.env.REACT_APP_CUSTOM_REQUEST_HEADER;

    try {
      setIsLoading(true);
      const users = await fetch("/api/users", {
        headers: {
          "Content-Type": "application/json",
          "x-customrequired-header": headerToSend,
        },
      });
      const usersJson = await users.json();

      setVolunteers(usersJson);
      setAllVolunteers(usersJson);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.log(error);
    }
  }

  async function getNextEvent() {
    try {
      setIsLoading(true);

      const events = await fetch("/api/events");
      const eventsJson = await events.json();

      const dates = eventsJson.map((event) => {
        return Date.parse(event.date);
      });

      const nextDate = new Date(Math.max.apply(null, dates));
      const nextDateUtc = new Date(nextDate).toISOString();

      const nextEvent = eventsJson.filter((event) => {
        const eventDate = new Date(event.date).toISOString();
        return eventDate === nextDateUtc;
      });

      setIsCheckInReady(nextEvent[0].checkInReady);
      setNextEvent(nextEvent);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.log(error);
    }
  }

  async function setCheckInReady(e, nextEventId) {
    e.preventDefault();

    try {
      await fetch(`/api/events/${nextEventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        if (response.ok) {
          setIsCheckInReady(!isCheckInReady);
        }
      });
    } catch (error) {
      console.log(error);
      // setIsError(error);
      // setIsLoading(!isLoading);
    }
  }

  const handleChartTypeChange = (e) => {
    setDonutCharts(e.currentTarget.value);
  };

  useEffect(() => {
    getAndSetData();
    getNextEvent();
    getUsers();
  }, []);

  return (
    auth && auth.user ? (
      <div className="flex-container">
        <div className="dashboard admin-dashboard-wrap">

          <div className="header-admin-dashboard">
            <h2 className="header-stats">Stats by Location - Volunteer Hours</h2>
            <p className="dashboard-header-text-small">You have an event coming up:</p>
          </div>

          {isLoading ? (
              <Loading />
          ) : (
              <UpcomingEvent
                  isCheckInReady={isCheckInReady}
                  nextEvent={nextEvent}
                  setCheckInReady={setCheckInReady}
              />
          )}

          {isLoading ? (
              <Loading />
          ) : (
              <EventOverview
                  handleChartTypeChange={handleChartTypeChange}
                  chartTypes={chartTypes}
              />
          )}

          {isLoading ? (
              <Loading />
          ) : (
              <DonutChartContainer
                  chartName={"Total Volunteers"}
                  data={totalVolunteers}
              />
          )}

          {isLoading ? (
              <Loading />
          ) : (
              <DonutChartContainer
                  chartName={"Total Volunteer Hours"}
                  data={totalVolunteerHours}
              />
          )}

          {isLoading ? (
              <Loading />
          ) : (
              <DonutChartContainer
                  chartName={"Average Hours Per Volunteer"}
                  data={totalVolunteerAvgHours}
              />
          )}
        </div>
      </div>
    ) : (
        <Redirect to="/login" />
    )
  );
};

export default AdminDashboard;
