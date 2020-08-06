import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import useAuth from "../hooks/useAuth";

import "../sass/Dashboard.scss";
import UpcomingEvent from "../components/presentational/upcomingEvent";
import EventOverview from "../components/presentational/eventOverview";
import DonutChartContainer from "../components/presentational/donutChartContainer";
import Loading from "../components/presentational/donutChartLoading";

const AdminDashboard = (props) => {
  const auth = useAuth();

  //STATE
  const [nextEvent, setNextEvent] = useState([]);
  const [isCheckInReady, setIsCheckInReady] = useState();
  const [volunteers, setVolunteers] = useState(null);
  const [totalVolunteers, setTotalVolunteers] = useState(null);
  const [locationsTotal, setLocationsTotal] = useState({});
  const [uniqueLocations, setUniqueLocations] = useState(null);
  const [volunteersSignedIn, setVolunteersSignedIn] = useState({});
  const [volunteeredHours, setVolunteeredHours] = useState({});
  const [averagedHours, setAveragedHours] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  async function getAndSetData() {
    try {
      setIsLoading(true);
      const checkIns = await fetch("/api/checkins");
      const checkInsJson = await checkIns.json();
      const events = await fetch("/api/events");
      const eventsJson = await events.json();
      let locationKeys = findUniqueLocationsKeys(eventsJson);
      let uniqueLocations = findUniqueLocations(eventsJson);
      let uniqueUsers = findUniqueUsers(
        locationKeys,
        uniqueLocations,
        checkInsJson
      );
      let totalUsers = findTotalUsers(
        locationKeys,
        uniqueLocations,
        checkInsJson
      );

      setUniqueLocations(uniqueUsers);
      setLocationsTotal(totalUsers);
      setDonutCharts("All", uniqueUsers, totalUsers);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  function findUniqueLocations(events) {
    let returnObj = events.reduce(
      (acc, cur) => {
        acc[cur.hacknight] = [];
        return acc;
      },
      { All: [] }
    );
    return returnObj;
  }

  function findUniqueLocationsKeys(events) {
    let returnObj = events.reduce((acc, cur) => {
      acc[cur._id] = cur.hacknight;
      return acc;
    }, {});

    return returnObj;
  }

  function findUniqueUsers(locationKeys, uniqueLocations, checkInsJson) {
    let returnObj = JSON.parse(JSON.stringify(uniqueLocations));
    checkInsJson.forEach((cur) => {
      let userLocation = locationKeys[cur.eventId];
      let userId = cur.userId;

      if (!returnObj[userLocation].includes(userId)) {
        returnObj[userLocation].push(userId);
      }
    });
    return returnObj;
  }
  function findTotalUsers(locationKeys, uniqueLocations, checkInsJson) {
    let returnObj = JSON.parse(JSON.stringify(uniqueLocations));
    checkInsJson.forEach((cur) => {
      let userLocation = locationKeys[cur.eventId];
      let userId = cur.userId;

      returnObj[userLocation].push(userId);
    });
    return returnObj;
  }

  function findVolunteersSignedIn(
    targetBrigade,
    immediateUniqueLocations = uniqueLocations,
    immediateLocationsTotal = locationsTotal
  ) {
    let returnObj = {};
    if (targetBrigade !== "All") {
      returnObj[targetBrigade] = immediateUniqueLocations[targetBrigade].length;
    } else {
      for (let keys in immediateUniqueLocations) {
        returnObj[keys] = immediateUniqueLocations[keys].length;
      }
      delete returnObj.All;
    }
    setVolunteersSignedIn(returnObj);
  }
  function findVolunteeredHours(
    targetBrigade,
    immediateUniqueLocations = uniqueLocations,
    immediateLocationsTotal = locationsTotal
  ) {
    let returnObj = {};

    if (targetBrigade !== "All") {
      returnObj[targetBrigade] =
        immediateUniqueLocations[targetBrigade].length * 3;
    } else {
      for (let keys in immediateUniqueLocations) {
        returnObj[keys] = immediateUniqueLocations[keys].length * 3;
      }
      delete returnObj.All;
    }
    setVolunteeredHours(returnObj);
  }

  function findAveragedHours(
    targetBrigade,
    immediateUniqueLocations = uniqueLocations,
    immediateLocationsTotal = locationsTotal
  ) {
    let returnObj = {};

    if (targetBrigade !== "All") {
      returnObj[targetBrigade] =
        Math.round(
          (100 * (immediateUniqueLocations[targetBrigade].length * 3)) /
            immediateLocationsTotal[targetBrigade].length
        ) / 100;
    } else {
      for (let keys in immediateUniqueLocations) {
        returnObj[keys] =
          Math.round(
            (100 * (immediateUniqueLocations[keys].length * 3)) /
              immediateLocationsTotal[keys].length
          ) / 100;
      }
      delete returnObj.All;
    }
    setAveragedHours(returnObj);
  }

  function setDonutCharts(
    targetBrigade,
    immediateUniqueLocations = uniqueLocations,
    immediateLocationsTotal = locationsTotal
  ) {
    findVolunteersSignedIn(
      targetBrigade,
      immediateUniqueLocations,
      immediateLocationsTotal
    );
    findVolunteeredHours(
      targetBrigade,
      immediateUniqueLocations,
      immediateLocationsTotal
    );
    findAveragedHours(
      targetBrigade,
      immediateUniqueLocations,
      immediateLocationsTotal
    );
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
      setTotalVolunteers(usersJson);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.log(error);
    }
  }
  async function setCheckInReady(e, nextEventId) {
    e.preventDefault();

    try {
      setIsLoading(true);

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
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      // setIsError(error);
      // setIsLoading(!isLoading);
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
  const handleBrigadeChange = (e) => {
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
        <div className="dashboard">
          <div className="dashboard-header">
            <p className="dashboard-header-text-small">
              You have an event coming up:
            </p>
          </div>

          {isLoading ? <img src={Loading} alt="Logo" /> : (
            <UpcomingEvent
              isCheckInReady={isCheckInReady}
              nextEvent={nextEvent}
              setCheckInReady={setCheckInReady}
            />
          )}

          {isLoading ? (
            <img src={Loading} alt="Logo" />
          ) : (
            <EventOverview
              handleBrigadeChange={handleBrigadeChange}
              uniqueLocations={uniqueLocations}
            />
          )}

          {isLoading ? (
            <Loading />
          ) : (
            <DonutChartContainer
              chartName={"Total Volunteers"}
              data={volunteersSignedIn}
            />
          )}

          {isLoading ? (
            <Loading />
          ) : (
            <DonutChartContainer
              chartName={"Total Volunteer Hours"}
              data={volunteeredHours}
            />
          )}
          
          {isLoading ? (
            <Loading />
          ) : (
            <DonutChartContainer
              chartName={"Avg. Hours Per Volunteer"}
              data={averagedHours}
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