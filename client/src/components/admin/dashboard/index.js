import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import UpcomingEvent from '../../presentational/upcomingEvent';
import EventOverview from '../eventOverview';
import DonutChartContainer from '../donutChartContainer';
import Loading from '../donutChartLoading';
import TabsContainer from '../../../common/tabs';
import Tab from '../../../common/tabs/tab';
import LocationTableReport from '../reports';
import '../../../sass/Dashboard.scss';
import './index.scss';
import { REACT_APP_CUSTOM_REQUEST_HEADER as headerToSend} from '../../../utils/globalSettings';

const AdminDashboard = () => {
  const { auth } = useAuth();
  const defaultChartType = 'All Events';
  const eventsArr = [];

  let uniqueEventTypes = new Set();
  let hackNightUniqueLocations = new Set();

  //STATE
  // Next Event
  const [nextEvent, setNextEvent] = useState([]);
  const [isCheckInReady, setIsCheckInReady] = useState(false);

  // Charts
  const [chartTypes, setChartTypes] = useState(null);

  // Processed events, checkins
  const [processedEvents, setProcessedEvents] = useState([]);
  const [processedCheckins, setCheckins] = useState(null);

  // Volunteers SignedIn By Event Type
  const [
    totalVolunteersByEventType,
    setVolunteersSignedInByEventType,
  ] = useState({});
  const [
    totalVolunteerHoursByEventType,
    setVolunteeredHoursByEventType,
  ] = useState({});
  const [totalVolunteerAvgHoursByEventType, setAvgHoursByEventType] = useState(
    {}
  );

  // Volunteers SignedIn By HackNight Property
  const [
    totalVolunteersByHackNightProp,
    setVolunteersSignedInByHackNightProp,
  ] = useState({});
  const [
    totalVolunteerHoursByHackNightProp,
    setVolunteeredHoursByHackNightProp,
  ] = useState({});
  const [
    totalVolunteerAvgHoursByHackNightProp,
    setAvgHoursByHackNightProp,
  ] = useState({});

  // Volunteers To Chart
  const [totalVolunteers, setVolunteersToChart] = useState({});
  const [totalVolunteerHours, setVolunteeredHoursToChart] = useState({});
  const [totalVolunteerAvgHours, setAvgHoursToChart] = useState({});

  const [isLoading, setIsLoading] = useState(true);

  async function getAndSetData(signal) {
    try {
      const eventsRes = await fetch(
        '/api/events',
        {
          headers: {
            'x-customrequired-header': headerToSend,
          },
        },
        signal
      );
      const events = await eventsRes.json();
      const checkinsRes = await fetch(
        '/api/checkins',
        {
          headers: {
            'x-customrequired-header': headerToSend,
          },
        },
        signal
      );
      const checkins = await checkinsRes.json();
      processData(events, checkins);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  function processData(events, checkins) {
    const processedEvents = processEvents(events);
    setProcessedEvents([...eventsArr]);
    const checkinsByEvent = collectCheckinsByEventId(checkins);
    prepareDataForDonutCharts(processedEvents, checkinsByEvent);
  }

  function processEvents(rowEvents) {
    const events = {};

    for (let event of rowEvents) {
      if (!event) continue;

      // Process legacy data with undefined 'hours' property because initially an event length was 3 hours
      if (!event.hours) {
        event.hours = parseInt('3');
      }

      // Define unique event types and process events without 'eventType' property
      if (!event.eventType) {
        // Find events without 'eventType' property (30 events) and assign it
        event.eventType = 'Hacknight';
      }
      processEventTypes(event, 'eventType', uniqueEventTypes);

      // Extract events with 'hacknight' property & find unique locations in it
      if (event.hacknight) {
        processEventTypes(event, 'hacknight', hackNightUniqueLocations);
      }
      events[event._id] = event;
      eventsArr.push(event);
    }
    return events;
  }

  function processEventTypes(event, propName, uniqueTypes) {
    const capitalize = (str, lower = false) =>
      (lower ? str.toLowerCase() : str).replace(
        /(?:^|\s|["'([{])+\S/g,
        (match) => match.toUpperCase()
      );
    let type = capitalize(event[propName], true);
    event[propName] = type;
    uniqueTypes.add(type);
  }

  function collectCheckinsByEventId(rowCheckins) {
    const checkins = {};
    for (let checkin of rowCheckins) {
      if (checkin.eventId !== null) {
        if (typeof checkins[checkin.eventId] !== 'undefined') {
          checkins[checkin.eventId].push(checkin);
        } else {
          checkins[checkin.eventId] = [checkin];
        }
      }
    }
    setCheckins({ ...checkins });
    return checkins;
  }

  function createChartTypes() {
    let chartTypes = {
      'All Events': '',
      'Hacknight Only': '',
    };
    setChartTypes(chartTypes);
  }

  function prepareDataForDonutCharts(events, checkins) {
    // Data for 1 chart 'total volunteers'
    let totalVolunteersByEventType = extractVolunteersSignedInByProperty(
      events,
      checkins,
      uniqueEventTypes,
      'eventType'
    );
    setVolunteersSignedInByEventType(totalVolunteersByEventType);

    let totalVolunteersByHackNightProp = extractVolunteersSignedInByProperty(
      events,
      checkins,
      hackNightUniqueLocations,
      'hacknight'
    );
    setVolunteersSignedInByHackNightProp(totalVolunteersByHackNightProp);

    // Data for 2 chart 'total hours'
    let totalVolunteerHoursByEventType = findTotalVolunteerHours(
      events,
      checkins,
      uniqueEventTypes,
      'eventType'
    );
    setVolunteeredHoursByEventType(totalVolunteerHoursByEventType);

    let totalVolunteerHoursByHackNightProp = findTotalVolunteerHours(
      events,
      checkins,
      hackNightUniqueLocations,
      'hacknight'
    );
    setVolunteeredHoursByHackNightProp(totalVolunteerHoursByHackNightProp);

    //  Data for 3 chart 'total average hours'
    let totalVolunteerAvgHoursByEventType = findAverageVolunteerHours(
      totalVolunteersByEventType,
      totalVolunteerHoursByEventType,
      uniqueEventTypes
    );
    setAvgHoursByEventType(totalVolunteerAvgHoursByEventType);

    let totalVolunteerAvgHoursByHackNightProp = findAverageVolunteerHours(
      totalVolunteersByHackNightProp,
      totalVolunteerHoursByHackNightProp,
      hackNightUniqueLocations
    );
    setAvgHoursByHackNightProp(totalVolunteerAvgHoursByHackNightProp);

    // Display data by default for "All" chart type
    setVolunteersToChart(totalVolunteersByEventType);
    setVolunteeredHoursToChart(totalVolunteerHoursByEventType);
    setAvgHoursToChart(totalVolunteerAvgHoursByEventType);
  }

  function extractVolunteersSignedInByProperty(
    events,
    checkins,
    uniqueTypes,
    propName
  ) {
    let result = {};
    let type;

    uniqueTypes.forEach((el) => (result[el] = parseInt('0')));
    for (const [key] of Object.entries(checkins)) {
      // key is eventId
      if (propName === 'eventType' && !!events[key]) {
        type = events[key].eventType;
        result[type] = checkins[key].length + result[type];
      }

      if (
        !!events[key] &&
        propName === 'hacknight' &&
        typeof events[key].hacknight !== 'undefined'
      ) {
        type = events[key].hacknight;
        result[type] = checkins[key].length + result[type];
      }
    }
    return result;
  }

  function findTotalVolunteerHours(events, checkins, uniqueTypes, propName) {
    let result = {};
    let type;
    uniqueTypes.forEach((el) => (result[el] = parseInt('0')));

    for (const [key] of Object.entries(checkins)) {
      if (!!events[key] && propName === 'eventType') {
        type = events[key].eventType;
        const eventHours =
          result[type] + events[key].hours * checkins[key].length;
        result[type] = Math.round(100 * eventHours) / 100;
      }

      if (
        !!events[key] &&
        propName === 'hacknight' &&
        typeof events[key].hacknight !== 'undefined'
      ) {
        type = events[key].hacknight;
        const hackHours =
          result[type] + events[key].hours * checkins[key].length;
        result[type] = Math.round(100 * hackHours) / 100;
      }
    }
    return result;
  }

  function findAverageVolunteerHours(
    totalVolunteers,
    totalVolunteerHours,
    uniqueTypes
  ) {
    let result = {};
    uniqueTypes.forEach((el) => (result[el] = parseInt('0')));
    for (let eventType of uniqueTypes.keys()) {
      let hours = totalVolunteerHours[eventType];
      let volunteers = totalVolunteers[eventType];
      let averageHours = hours / volunteers;
      if (!Number.isInteger(averageHours)) {
        averageHours = Math.round(100 * averageHours) / 100;
      }
      volunteers > 0
        ? (result[eventType] = averageHours)
        : (result[eventType] = 0);
    }
    return result;
  }

  function setDonutCharts(valueFromSelect) {
    // Display data depending on value from select
    if (valueFromSelect === defaultChartType) {
      setVolunteersToChart(totalVolunteersByEventType);
      setVolunteeredHoursToChart(totalVolunteerHoursByEventType);
      setAvgHoursToChart(totalVolunteerAvgHoursByEventType);
    } else if (valueFromSelect === 'Hacknight Only') {
      setVolunteersToChart(totalVolunteersByHackNightProp);
      setVolunteeredHoursToChart(totalVolunteerHoursByHackNightProp);
      setAvgHoursToChart(totalVolunteerAvgHoursByHackNightProp);
    }
  }

  async function getNextEvent(signal) {
    try {
      setIsLoading(true);
      const events = await fetch('/api/events', {
        signal,
        headers: {
          'x-customrequired-header': headerToSend,
        },
      });
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
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        if (response.ok) {
          setIsCheckInReady(!isCheckInReady);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleChartTypeChange = (e) => {
    setDonutCharts(e.currentTarget.value);
  };

  const handleFilteredData = (filteredEvents) => {
    const prepEvents = processEvents(filteredEvents);
    prepareDataForDonutCharts(prepEvents, processedCheckins);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getAndSetData({ signal: signal }).then(() => createChartTypes());
    getNextEvent({ signal: signal }).then();

    return function cleanup() {
      abortController.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return auth && auth.user ? (
    <div className="flex-container">
      <div className="dashboard admin-dashboard-wrap">
        <div className="admin-header">
          <h1>Stats by Location - Volunteer Hours</h1>
        </div>

        {!isLoading && nextEvent.length ? (
          !isCheckInReady &&
            <div className="event-header">You have 1 upcoming event:</div>
          ) : (
            <div className="event-header">Current event:</div>
          )
        }

        <div className="admin-upcoming-event">
          {isLoading ? (
            <Loading />
          ) : (
            <UpcomingEvent
              isCheckInReady={isCheckInReady}
              nextEvent={nextEvent}
              setCheckInReady={setCheckInReady}
            />
          )}
        </div>

        <TabsContainer active={0}>
          <Tab title="Table Report">
            {isLoading ? (
              <Loading />
            ) : (
              <LocationTableReport
                eventTypeStats={[
                  totalVolunteersByEventType,
                  totalVolunteerHoursByEventType,
                  totalVolunteerAvgHoursByEventType,
                ]}
                hackNightTypeStats={[
                  totalVolunteersByHackNightProp,
                  totalVolunteerHoursByHackNightProp,
                  totalVolunteerAvgHoursByHackNightProp,
                ]}
                processedEvents={processedEvents}
                handleFilteredData={handleFilteredData}
              />
            )}
          </Tab>

          <Tab title="Donut Chart Report">
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
                chartName={'Total Volunteers'}
                data={totalVolunteers}
              />
            )}

            {isLoading ? (
              <Loading />
            ) : (
              <DonutChartContainer
                chartName={'Total Volunteer Hours'}
                data={totalVolunteerHours}
              />
            )}

            {isLoading ? (
              <Loading />
            ) : (
              <DonutChartContainer
                chartName={'Average Hours Per Volunteer'}
                data={totalVolunteerAvgHours}
              />
            )}
          </Tab>
        </TabsContainer>
      </div>
    </div>
  ) : (
    <Redirect to="/login" />
  );
};

export default AdminDashboard;
