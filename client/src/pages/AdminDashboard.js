import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { round } from 'mathjs';

import useAuth from '../hooks/useAuth';

import DonutChart from '../components/DonutChart';

import { ReactComponent as ClockIcon} from '../svg/Icon_Clock.svg';
import { ReactComponent as LocationIcon} from '../svg/Icon_Location.svg';

import '../sass/Dashboard.scss';

const AdminDashboard = (props) => {
    const auth = useAuth();

    const [nextEvent, setNextEvent] = useState([]);
    const [isCheckInReady, setIsCheckInReady] = useState();
    const [brigade, setBrigade] = useState("All");
    const [checkIns, setCheckIns] = useState(null);
    const [sortedDtlaCheckIns, setSortedDtlaCheckIns] = useState(null);
    const [sortedWestsideCheckIns, setSortedWestsideCheckIns] = useState(null);
    const [sortedSouthLaCheckIns, setSortedSouthLaCheckIns] = useState(null);
    const [sortedCheckIns, setSortedCheckIns] = useState(null);
    const [volunteers, setVolunteers] = useState(null);
    const [totalVolunteers, setTotalVolunteers] = useState(null);
    const [dtlaEvents, setDtlaEvents] = useState(null);
    const [westsideEvents, setWestsideEvents] = useState(null);
    const [southLaEvents, setSouthLaEvents] = useState(null);
    const [dtlaVolunteers, setDtlaVolunteers] = useState(null);
    const [westsideVolunteers, setWestsideVolunteers] = useState(null);
    const [southLaVolunteers, setSouthLaVolunteers] = useState(null);

    async function getAndSetData() {
        try {
            const checkIns = await fetch('/api/checkins');
            const checkInsJson = await checkIns.json();

            setCheckIns(checkInsJson);

            const events = await fetch('/api/events');
            const eventsJson = await events.json();

            const hackNights = eventsJson.map(event => {
                const { hacknight, _id } = event;
                return { hacknight, _id };
            });
            // Filter events into it's own array
            const dtlaEvents = hackNights.filter(event => {
                return event.hacknight === "DTLA";
            });

            setDtlaEvents(dtlaEvents);

            let dtlaVolunteersArray = [];

            // For every DTLA Event...
            for (let eventCount = 0; eventCount < dtlaEvents.length; eventCount++) {
                // Filter the check-ins by all of the check-ins that have
                // the event ID matching a DTLA event
                const dtlaVolunteers = checkInsJson.filter(checkIn => {
                    return checkIn.eventId === dtlaEvents[eventCount]._id;
                });
                // Push those check-ins into the array we created above
                dtlaVolunteersArray.push(dtlaVolunteers);
            }

            // Flatten the array above (comes as multiple arrays within an array)
            const flattenedDtlaArray = [].concat(...dtlaVolunteersArray);
            // Create a new array from a set (a set removes duplicate values) to 
            // get the unique volunteers for that specific Hack Night (DTLA)
            const uniqueDtlaVolunteers = Array.from(new Set(flattenedDtlaArray.map(volunteer => volunteer.userId)));
            
            setSortedDtlaCheckIns(flattenedDtlaArray);
            setDtlaVolunteers(uniqueDtlaVolunteers);

            const westsideEvents = hackNights.filter(event => {
                return event.hacknight === "Westside";
            });

            setWestsideEvents(westsideEvents);

            let westsideVolunteersArray = [];

            for (let eventCount = 0; eventCount < westsideEvents.length; eventCount++) {
                const westsideVolunteers = checkInsJson.filter(checkIn => {
                    return checkIn.eventId === westsideEvents[eventCount]._id;
                });

                westsideVolunteersArray.push(westsideVolunteers);
            }

            const flattenedWestsideArray = [].concat(...westsideVolunteersArray);
            const uniqueWestsideVolunteers = Array.from(new Set(flattenedWestsideArray.map(volunteer => volunteer.userId)));

            setSortedWestsideCheckIns(flattenedWestsideArray);
            setWestsideVolunteers(uniqueWestsideVolunteers);
            
            const southLaEvents = hackNights.filter(event => {
                return event.hacknight === "South LA";
            });

            setSouthLaEvents(southLaEvents);

            let southLaVolunteersArray = [];

            for (let eventCount = 0; eventCount < southLaEvents.length; eventCount++) {
                const southLaVolunteers = checkInsJson.filter(checkIn => {
                    return checkIn.eventId === southLaEvents[eventCount]._id;
                });

                southLaVolunteersArray.push(southLaVolunteers);
            }

            const flattenedSouthLaArray = [].concat(...southLaVolunteersArray);
            const uniqueSouthLaVolunteers = Array.from(new Set(flattenedSouthLaArray.map(volunteer => volunteer.userId)));

            setSortedSouthLaCheckIns(flattenedSouthLaArray);
            setSouthLaVolunteers(uniqueSouthLaVolunteers);
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
            console.log(nextDate);
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
    };

    const totalHours = (checkIns !== null) && (checkIns.length) * 3; // assuming 3 hours per hack night event (per check-in)
    const dtlaHours = (sortedDtlaCheckIns !== null) && sortedDtlaCheckIns.length * 3;
    const westsideHours = (sortedWestsideCheckIns !== null) && sortedWestsideCheckIns.length * 3;
    const southLaHours = (sortedSouthLaCheckIns !== null) && sortedSouthLaCheckIns.length * 3;

    const avgHoursPerVol = (totalVolunteers !== null) && (round((totalHours/totalVolunteers.length) * 100) / 100).toFixed(2);
    const avgHoursPerDtlaVol = (dtlaVolunteers !== null) && (round((dtlaHours/dtlaVolunteers.length) * 100) / 100).toFixed(2);
    const avgHoursPerWestsideVol = (westsideVolunteers !== null) && (round((westsideHours/westsideVolunteers.length) * 100) / 100).toFixed(2);
    const avgHoursPerSouthLaVol = (southLaVolunteers !== null) && (round((southLaHours/southLaVolunteers.length) * 100) / 100).toFixed(2);

    const handleBrigadeChange = (e) => {
        setBrigade(e.currentTarget.value);

        if (e.currentTarget.value === "DTLA") {
            setVolunteers(dtlaVolunteers);
        }

        if (e.currentTarget.value === "Westside") {
            setVolunteers(westsideVolunteers);
        }

        if (e.currentTarget.value === "South LA") {
            setVolunteers(southLaVolunteers);
        }

        if (e.currentTarget.value === "All") {
            setVolunteers(totalVolunteers);
        }
    };

    const brigadeSelection = ["All", "DTLA", "Westside", "South LA"];

    useEffect(() => {
        getAndSetData();
        getNextEvent();
        getUsers();
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

                        <div className="dashboard-chart-container">
                            {dtlaVolunteers !== null && westsideVolunteers !== null && southLaVolunteers !== null && (
                                brigade === "All" &&
                                    <DonutChart
                                        data={[{value: dtlaVolunteers.length, color: "#2A768A"}, {value: westsideVolunteers.length, color: "#102D49"}, {value: southLaVolunteers.length, color: "#CD1F42"}]}
                                        width={160}
                                        height={160}
                                        innerRadius={40}
                                        outerRadius={80}
                                    />
                            )}
                            {dtlaVolunteers !== null && westsideVolunteers !== null && southLaVolunteers !== null && (
                                brigade === "DTLA" &&
                                    <DonutChart
                                        data={[{value: dtlaVolunteers.length, color: "#2A768A"}]}
                                        width={160}
                                        height={160}
                                        innerRadius={40}
                                        outerRadius={80}
                                    />
                            )}
                            {dtlaVolunteers !== null && westsideVolunteers !== null && southLaVolunteers !== null && (
                                brigade === "Westside" &&
                                    <DonutChart
                                        data={[{value: westsideVolunteers.length, color: "#102D49"}]}
                                        width={160}
                                        height={160}
                                        innerRadius={40}
                                        outerRadius={80}
                                    />
                            )}
                            {dtlaVolunteers !== null && westsideVolunteers !== null && southLaVolunteers !== null && (
                                brigade === "South LA" &&
                                    <DonutChart
                                        data={[{value: southLaVolunteers.length, color: "#CD1F42"}]}
                                        width={160}
                                        height={160}
                                        innerRadius={40}
                                        outerRadius={80}
                                    />
                            )}

                            {brigade === "All" && (
                                <div className="key-wrapper">
                                    <div className="key-container">
                                        <div className="key-info-container">
                                            <div className="key-color light-blue">

                                            </div>
                                            <div className="key-location">
                                                <p>DTLA: {dtlaVolunteers !== null && dtlaVolunteers.length}</p>
                                            </div>
                                        </div>

                                        <div className="key-info-container">
                                            <div className="key-color dark-blue">

                                            </div>
                                            <div className="key-location">
                                                <p>Westside: {westsideVolunteers !== null && westsideVolunteers.length}</p>
                                            </div>
                                        </div>

                                        <div className="key-info-container">
                                            <div className="key-color dark-red">

                                            </div>
                                            <div className="key-location">
                                                <p>South LA: {southLaVolunteers !== null && southLaVolunteers.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {brigade === "DTLA" && (
                                <div className="key-wrapper">
                                    <div className="key-container">
                                        <div className="key-info-container">
                                            <div className="key-color light-blue">

                                            </div>
                                            <div className="key-location">
                                                <p>DTLA: {dtlaVolunteers !== null && dtlaVolunteers.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {brigade === "Westside" && (
                                <div className="key-wrapper">
                                    <div className="key-container">
                                        <div className="key-info-container">
                                            <div className="key-color dark-blue">

                                            </div>
                                            <div className="key-location">
                                                <p>Westside: {westsideVolunteers !== null && westsideVolunteers.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {brigade === "South LA" && (
                                <div className="key-wrapper">
                                    <div className="key-container">
                                        <div className="key-info-container">
                                            <div className="key-color dark-red">

                                            </div>
                                            <div className="key-location">
                                                <p>South LA: {southLaVolunteers !== null && southLaVolunteers.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}   
                        </div>
                    </div>

                    <div className="dashboard-stats">
                        <div className="dashboard-stat-container">
                            <div className="stat-header">
                                <p className="stat-header-text">Total Hours Volunteered:</p>
                            </div>
                            <div className="stat-number">
                                <p>
                                    {brigade === "All" ? (totalHours) : (null)}
                                    {brigade === "DTLA" ? (dtlaHours) : (null)}
                                    {brigade === "Westside" ? (westsideHours) : (null)}
                                    {brigade === "South LA" ? (southLaHours) : (null)}
                                </p>
                            </div>
                        </div>

                        <div className="dashboard-chart-container">
                            {dtlaHours !== null && westsideHours !== null && southLaHours !== null && (
                                brigade === "All" &&
                                    <DonutChart
                                        data={[{value: dtlaHours, color: "#2A768A"}, {value: westsideHours, color: "#102D49"}, {value: southLaHours, color: "#CD1F42"}]}
                                        width={160}
                                        height={160}
                                        innerRadius={40}
                                        outerRadius={80}
                                    />
                            )}

                            {dtlaHours !== null && westsideHours !== null && southLaHours !== null && (
                                brigade === "DTLA" &&
                                    <DonutChart
                                        data={[{value: dtlaHours, color: "#2A768A"}]}
                                        width={160}
                                        height={160}
                                        innerRadius={40}
                                        outerRadius={80}
                                    />
                            )}

                            {dtlaHours !== null && westsideHours !== null && southLaHours !== null && (
                                brigade === "Westside" &&
                                    <DonutChart
                                        data={[{value: westsideHours, color: "#102D49"}]}
                                        width={160}
                                        height={160}
                                        innerRadius={40}
                                        outerRadius={80}
                                    />
                            )}

                            {dtlaHours !== null && westsideHours !== null && southLaHours !== null && (
                                brigade === "South LA" &&
                                    <DonutChart
                                        data={[{value: southLaHours, color: "#CD1F42"}]}
                                        width={160}
                                        height={160}
                                        innerRadius={40}
                                        outerRadius={80}
                                    />
                            )}

                            {brigade === "All" && (
                                <div className="key-wrapper">
                                    <div className="key-container">
                                        <div className="key-info-container">
                                            <div className="key-color light-blue">

                                            </div>
                                            <div className="key-location">
                                                <p>DTLA: {dtlaHours !== null && dtlaHours}</p>
                                            </div>
                                        </div>

                                        <div className="key-info-container">
                                            <div className="key-color dark-blue">

                                            </div>
                                            <div className="key-location">
                                                <p>Westside: {westsideHours !== null && westsideHours}</p>
                                            </div>
                                        </div>

                                        <div className="key-info-container">
                                            <div className="key-color dark-red">

                                            </div>
                                            <div className="key-location">
                                                <p>South LA: {southLaHours !== null && southLaHours}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {brigade === "DTLA" && (
                                <div className="key-wrapper">
                                    <div className="key-container">
                                        <div className="key-info-container">
                                            <div className="key-color light-blue">

                                            </div>
                                            <div className="key-location">
                                                <p>DTLA: {dtlaHours !== null && dtlaHours}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {brigade === "Westside" && (
                                <div className="key-wrapper">
                                    <div className="key-container">
                                        <div className="key-info-container">
                                            <div className="key-color dark-blue">

                                            </div>
                                            <div className="key-location">
                                                <p>Westside: {westsideHours !== null && westsideHours}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {brigade === "South LA" && (
                                <div className="key-wrapper">
                                    <div className="key-container">
                                        <div className="key-info-container">
                                            <div className="key-color dark-red">

                                            </div>
                                            <div className="key-location">
                                                <p>South LA: {southLaHours !== null && southLaHours}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="dashboard-stats">
                        <div className="dashboard-stat-container">
                            <div className="stat-header">
                                <p className="stat-header-text">Average Hours Per Volunteer:</p>
                            </div>
                            <div className="stat-number">
                                <p>
                                    {brigade === "All" ? (avgHoursPerVol) : (null)}
                                    {brigade === "DTLA" ? (avgHoursPerDtlaVol) : (null)}
                                    {brigade === "Westside" ? (avgHoursPerWestsideVol) : (null)}
                                    {brigade === "South LA" ? (avgHoursPerSouthLaVol) : (null)}
                                </p>
                            </div>
                        </div>

                        <div className="dashboard-chart-container">
                            {avgHoursPerDtlaVol !== null && avgHoursPerWestsideVol !== null && avgHoursPerSouthLaVol !== null && (
                                brigade === "All" &&
                                    <DonutChart
                                        data={[{value: avgHoursPerDtlaVol, color: "#2A768A"}, {value: avgHoursPerWestsideVol, color: "#102D49"}, {value: avgHoursPerSouthLaVol, color: "#CD1F42"}]}
                                        width={160}
                                        height={160}
                                        innerRadius={40}
                                        outerRadius={80}
                                    />
                            )}
                            {avgHoursPerDtlaVol !== null && avgHoursPerWestsideVol !== null && avgHoursPerSouthLaVol !== null && (
                                brigade === "DTLA" &&
                                    <DonutChart
                                        data={[{value: avgHoursPerDtlaVol, color: "#2A768A"}]}
                                        width={160}
                                        height={160}
                                        innerRadius={40}
                                        outerRadius={80}
                                    />
                            )}
                            {avgHoursPerDtlaVol !== null && avgHoursPerWestsideVol !== null && avgHoursPerSouthLaVol !== null && (
                                brigade === "Westside" &&
                                    <DonutChart
                                        data={[{value: avgHoursPerWestsideVol, color: "#102D49"}]}
                                        width={160}
                                        height={160}
                                        innerRadius={40}
                                        outerRadius={80}
                                    />
                            )}
                            {avgHoursPerDtlaVol !== null && avgHoursPerWestsideVol !== null && avgHoursPerSouthLaVol !== null && (
                                brigade === "South LA" &&
                                    <DonutChart
                                        data={[{value: avgHoursPerSouthLaVol, color: "#CD1F42"}]}
                                        width={160}
                                        height={160}
                                        innerRadius={40}
                                        outerRadius={80}
                                    />
                            )}

                            {brigade === "All" && (
                                <div className="key-wrapper">
                                    <div className="key-container">
                                        <div className="key-info-container">
                                            <div className="key-color light-blue">

                                            </div>
                                            <div className="key-location">
                                                <p>DTLA: {avgHoursPerDtlaVol !== null && avgHoursPerDtlaVol}</p>
                                            </div>
                                        </div>

                                        <div className="key-info-container">
                                            <div className="key-color dark-blue">

                                            </div>
                                            <div className="key-location">
                                                <p>Westside: {avgHoursPerWestsideVol !== null && avgHoursPerWestsideVol.length}</p>
                                            </div>
                                        </div>

                                        <div className="key-info-container">
                                            <div className="key-color dark-red">

                                            </div>
                                            <div className="key-location">
                                                <p>South LA: {avgHoursPerSouthLaVol !== null && avgHoursPerSouthLaVol}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {brigade === "DTLA" && (
                                <div className="key-wrapper">
                                    <div className="key-container">
                                        <div className="key-info-container">
                                            <div className="key-color light-blue">

                                            </div>
                                            <div className="key-location">
                                                <p>DTLA: {avgHoursPerDtlaVol !== null && avgHoursPerDtlaVol}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {brigade === "Westside" && (
                                <div className="key-wrapper">
                                    <div className="key-container">
                                        <div className="key-info-container">
                                            <div className="key-color dark-blue">

                                            </div>
                                            <div className="key-location">
                                                <p>Westside: {avgHoursPerWestsideVol !== null && avgHoursPerWestsideVol}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {brigade === "South LA" && (
                                <div className="key-wrapper">
                                    <div className="key-container">
                                        <div className="key-info-container">
                                            <div className="key-color dark-red">

                                            </div>
                                            <div className="key-location">
                                                <p>South LA: {avgHoursPerSouthLaVol !== null && avgHoursPerSouthLaVol}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        // ) : (
        //     <Redirect to="/login" />
        // )
    )
};

export default AdminDashboard;
    