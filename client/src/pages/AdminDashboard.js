import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { round } from 'mathjs';

import Firebase from '../firebase';

import useAuth from '../hooks/useAuth';

import { ReactComponent as ClockIcon} from '../svg/Icon_Clock.svg';
import { ReactComponent as LocationIcon} from '../svg/Icon_Location.svg';

import '../sass/Dashboard.scss';

const AdminDashboard = (props) => {
    // const auth = useAuth();

    
    const [brigades, setBrigades] = useState([]);
    const [events, setEvents] = useState([]);
    const [nextEvent, setNextEvent] = useState([]);
    const [isCheckInReady, setIsCheckInReady] = useState();
    const [brigade, setBrigade] = useState("All");
    const [checkIns, setCheckIns] = useState(null);
    const [sortedCheckIns, setSortedCheckIns] = useState(null);
    const [volunteers, setVolunteers] = useState(null);
    const [totalVolunteers, setTotalVolunteers] = useState(null);
    const [satisfiedVolunteers, setSatisfiedVolunteers] = useState(null);
    const [dtlaEvents, setDtlaEvents] = useState(null);
    const [westsideEvents, setWestsideEvents] = useState(null);
    const [southLaEvents, setSouthLaEvents] = useState(null);
    const [users, setUsers] = useState([]);
    const [tabSelected, setTabSelected] = useState();
    const [optionSelected, setOptionSelected] = useState("left");
    const [eventsIsSelected, setEventsIsSelected] = useState(false);
    const [usersIsSelected, setUsersIsSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function getAndSetBrigadeEvents() {
        try {
            const events = await fetch('/api/events');
            const eventsJson = await events.json();

            const hackNights = eventsJson.map(event => {
                const { hacknight, _id } = event;
                return { hacknight, _id };
            });

            const dtlaEvents = hackNights.filter(event => {
                return event.hacknight === "DTLA";
            });

            setDtlaEvents(dtlaEvents);

            const westsideEvents = hackNights.filter(event => {
                return event.hacknight === "Westside";
            });

            setWestsideEvents(westsideEvents);
            
            const southLaEvents = hackNights.filter(event => {
                return event.hacknight === "South LA";
            });

            setSouthLaEvents(southLaEvents);
        } catch(error) {
            console.log(error);
        }
    }

    async function getCheckIns() {
        try {
            const checkIns = await fetch('/api/checkins');
            const checkInsJson = await checkIns.json();

            setCheckIns(checkInsJson);
        } catch(error) {
            console.log(error);
        }
    }

    async function getUsers() {
        const headerToSend = process.env.REACT_APP_CUSTOM_REQUEST_HEADER;

        try {
            const users = await fetch('/api/users', {
                headers: {
                    "Content-Type": "application/json",
                    "x-customrequired-header": headerToSend
                }
            });
            const usersJson = await users.json();

            setVolunteers(usersJson);
            setTotalVolunteers(usersJson);
        } catch(error) {
            console.log(error);
        }
    }

    async function getNextEvent() {
        try {
            const events = await fetch('/api/events');
            const eventsJson = await events.json();

            const dates = eventsJson.map(event => {
                return Date.parse(event.date);
            });

            const nextDate = new Date(Math.max.apply(null, dates));
            const nextDateUtc = new Date(nextDate).toISOString();

            const nextEvent = eventsJson.filter(event => {
                const eventDate = new Date(event.date).toISOString();
                return eventDate === nextDateUtc;
            });

            setIsCheckInReady(nextEvent[0].checkInReady);
            setNextEvent(nextEvent);
        } catch(error) {
            // setIsError(error);
            // setIsLoading(!isLoading);
            console.log(error);
        }
    }

    async function setCheckInReady(e, nextEventId) {
        e.preventDefault();
        
        try {
            await fetch(`/api/events/${nextEventId}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    if (response.ok) {
                        setIsCheckInReady(!isCheckInReady);
                    }
                });

        } catch(error) {
            // setIsError(error);
            // setIsLoading(!isLoading);
        }
    }

    const handleTabSelect = (e, selectedType) => {
        e.preventDefault();

        if(selectedType === "events") {
            setTabSelected("events");
            setUsersIsSelected(false);
            setEventsIsSelected(true);
        }

        if(selectedType === "users") {
            setTabSelected("users");
            setEventsIsSelected(false);
            setUsersIsSelected(true);
        }
    }

    const handleOptionSelect = (e, selectedType) => {
        e.preventDefault();

        if(selectedType === "left") {
            setOptionSelected("left");
            
        }

        if(selectedType === "right") {
            setOptionSelected("right");
            
        }
    }

    const totalHours = (checkIns !== null) && (checkIns.length) * 3; // assuming 3 hours per hack night event (per check-in)
    const brigadeHours = (sortedCheckIns !== null) && sortedCheckIns.length * 3; // sorted

    const avgHoursPerVol = (totalVolunteers !== null) && (round((totalHours/totalVolunteers.length) * 100) / 100).toFixed(2);
    const avgHoursPerBrigadeVol = (volunteers !== null) && (round((brigadeHours/volunteers.length) * 100) / 100).toFixed(2); // sorted

    const handleBrigadeChange = (e) => {
        setBrigade(e.currentTarget.value);

        if (e.currentTarget.value === "DTLA") {
            let dtlaVolunteersArray = [];

            for (let eventCount = 0; eventCount < dtlaEvents.length; eventCount++) {
                const dtlaVolunteers = checkIns.filter(checkIn => {
                    return checkIn.eventId === dtlaEvents[eventCount]._id;
                });

                dtlaVolunteersArray.push(dtlaVolunteers);
            }

            const flattenedArray = [].concat(...dtlaVolunteersArray);
            const uniqueVolunteers = Array.from(new Set(flattenedArray.map(volunteer => volunteer.userId)));
            
            setSortedCheckIns(flattenedArray);
            setVolunteers(uniqueVolunteers);
        }

        if (e.currentTarget.value === "Westside") {
            let westsideVolunteersArray = [];

            for (let eventCount = 0; eventCount < westsideEvents.length; eventCount++) {
                const westsideVolunteers = checkIns.filter(checkIn => {
                    return checkIn.eventId === westsideEvents[eventCount]._id;
                });

                westsideVolunteersArray.push(westsideVolunteers);
            }

            const flattenedArray = [].concat(...westsideVolunteersArray);
            const uniqueVolunteers = Array.from(new Set(flattenedArray.map(volunteer => volunteer.userId)));

            setSortedCheckIns(flattenedArray);
            setVolunteers(uniqueVolunteers);
        }

        if (e.currentTarget.value === "South LA") {
            let southLaVolunteersArray = [];

            for (let eventCount = 0; eventCount < southLaEvents.length; eventCount++) {
                const southLaVolunteers = checkIns.filter(checkIn => {
                    return checkIn.eventId === southLaEvents[eventCount]._id;
                });

                southLaVolunteersArray.push(southLaVolunteers);
            }

            const flattenedArray = [].concat(...southLaVolunteersArray);

            const uniqueVolunteers = Array.from(new Set(flattenedArray.map(volunteer => volunteer.userId)));

            setSortedCheckIns(flattenedArray);
            setVolunteers(uniqueVolunteers);
        }

        if (e.currentTarget.value === "All") {
            // const usersToCount = checkIns.filter((checkIn, index) => {
            //     return checkIns.indexOf(checkIn) === index;
            // });

            setVolunteers(totalVolunteers);
        }
    };

    const handleSatisfiedChange = (e) => {
        if (e.currentTarget.value === "DTLA") {
            const satisfiedVolunteers = totalVolunteers.filter(volunteer => {
                return volunteer.currentRole === volunteer.desiredRole;
            });

            setSatisfiedVolunteers(satisfiedVolunteers);
        }
    }

    const brigadeSelection = ["All", "DTLA", "Westside", "South LA"];

    useEffect(() => {
        getAndSetBrigadeEvents();
        getNextEvent();
        getUsers();
        getCheckIns();
    }, []);

    return (
        // auth && auth.user ? (
            <div className="flex-container">
                <div className="dashboard">
                    <div className="dashboard-header">
                        <p className="dashboard-header-text-small">You have an event coming up:</p>
                    </div>
            
                    {nextEvent[0] ? (
                        <div className="warning-event">
                            <div className="warning-event-headers">
                                <p className="event-name">{nextEvent[0].name}</p>
                                <div className="event-info-wrapper">
                                    <ClockIcon />
                                    <p className="event-info">{nextEvent[0].date}</p>
                                </div>
                                <div className="event-info-wrapper">
                                    <LocationIcon />
                                    <p className="event-info">{nextEvent[0].location.city}, {nextEvent[0].location.state}</p>
                                </div>
                            </div>
                            <div className="warning-event-toggle">
                                {nextEvent[0] && isCheckInReady === false ? 
                                    (
                                        <Link 
                                            to={`/events/${nextEvent[0]._id}`}
                                            className="checkin-toggle fill-green"
                                            onClick={e => setCheckInReady(e, nextEvent[0]._id)}>
                                                OPEN CHECK-IN
                                        </Link>
                                    ) : (
                                        <Link 
                                            to={`/events/${nextEvent[0]._id}`}
                                            className="checkin-toggle fill-red"
                                            onClick={e => setCheckInReady(e, nextEvent[0]._id)}>
                                                CLOSE CHECK-IN
                                        </Link>
                                    )
                                }
                            </div>
                        </div>
                    ) : (
                        <div>No events coming up!</div>
                    )}

                    <div className="dashboard-header">
                        <p className="dashboard-header-text-large">HackforLA Overview</p>

                        <form className="form-stats" autoComplete="off" onSubmit={e => e.preventDefault()}>
                            <div className="stats-form-row">
                                <div className="stats-form-input-text">
                                    <div className="stat-select">
                                        <label htmlFor="whichBrigade">Location:</label>
                                        <select 
                                            name="whichBrigade"
                                            value={brigade}
                                            // aria-label="topic"
                                            onChange={handleBrigadeChange}
                                            required
                                        >
                                        {brigadeSelection.map((brigade, index) => {
                                            return <option key={index} value={brigade}>{brigade}</option>
                                        })} 
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="dashboard-stats">
                        <div className="dashboard-stat-container">
                            <div className="stat-header">
                                <p className="stat-header-text">Total Volunteers:</p>
                            </div>
                            <div className="stat-number">
                                <p>{volunteers !== null && volunteers.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-stats">
                        <div className="dashboard-stat-container">
                            <div className="stat-header">
                                <p className="stat-header-text">Total Hours Volunteered:</p>
                            </div>
                            <div className="stat-number">
                                <p>
                                    {brigade === "All" ? (totalHours) : (brigadeHours)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-stats">
                        <div className="dashboard-stat-container">
                            <div className="stat-header">
                                <p className="stat-header-text">Average Hours Per Volunteer:</p>
                            </div>
                            <div className="stat-number">
                                <p>{brigade === "All" ? (avgHoursPerVol) : (avgHoursPerBrigadeVol)}</p>
                            </div>
                        </div>
                    </div>

                    {/* <div className="dashboard-stats">
                        <div className="dashboard-stat-container">
                            <div className="stat">
                                <h5>Current Role = Desired Role</h5>

                                <form className="form-stats" autoComplete="off" onSubmit={e => e.preventDefault()}>
                                    <div className="stats-form-row">
                                        <div className="form-input-text">
                                            <div className="stat-select">
                                                <select 
                                                    name={"whichBrigade"}
                                                    value={brigade}
                                                    // aria-label="topic"
                                                    onChange={handleSatisfiedChange}
                                                    required
                                                >
                                                {brigadeSelection.map((brigade, index) => {
                                                    return <option key={index} value={brigade}>{brigade}</option>
                                                })} 
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="stat-number">
                                <p>{satisfiedVolunteers !== null && satisfiedVolunteers.length}</p>
                            </div>
                        </div> 
                    </div> */}

                        {/* <div className="dashboard-stat-container">
                            <p>Total Check-Ins:</p>

                            <div>{checkIns !== null && checkIns.length}</div>

                            <form className="form-stats" autoComplete="off" onSubmit={e => e.preventDefault()}>
                                <div className="form-row">
                                    <div className="form-input-text">
                                        <div className="select-reason">
                                            <select 
                                                name={"whichBrigade"}
                                                value={brigade}
                                                // aria-label="topic"
                                                onChange={handleBrigadeChange}
                                                required
                                            >
                                            {brigades.map((brigade, index) => {
                                                return <option key={index} value={brigade}>{brigade}</option>
                                            })} 
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>  */}
                </div>
            </div>
        // ) : (
        //     <Redirect to="/login" />
        // )
    )
};

export default AdminDashboard;
    