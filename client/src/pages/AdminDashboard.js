import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';

import DashboardEvents from '../components/DashboardEvents';
import DashboardUsers from '../components/DashboardUsers';

import useAuth from '../hooks/useAuth';

import '../sass/Dashboard.scss';

const AdminDashboard = (props) => {
    const [events, setEvents] = useState([]);
    const [nextEvent, setNextEvent] = useState([]);
    const [isCheckInReady, setIsCheckInReady] = useState();
    const [users, setUsers] = useState([]);
    const [tabSelected, setTabSelected] = useState();
    const [optionSelected, setOptionSelected] = useState("left");
    const [eventsIsSelected, setEventsIsSelected] = useState(false);
    const [usersIsSelected, setUsersIsSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const auth = useAuth();

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

    useEffect(() => {
        getNextEvent();

    }, []);

    return (
        auth.user ? (
            <div className="flex-container">
                <div className="dashboard">
                    <div className="dashboard-headers">
                        <h3>Hi, {auth.user.name.firstName}</h3>
                    </div>
            
                    {nextEvent[0] ? (
                        <>
                            <div className="dashboard-warning">
                                <p>You have an event coming up:</p>
                            </div>
                            
                            <div className="warning-event">
                                <div className="warning-event-headers">
                                    <h4>{nextEvent[0].name}</h4>
                                    <p>{nextEvent[0].date}</p>
                                </div>
                                <div className="warning-event-toggle">
                                    {nextEvent[0] && isCheckInReady === false ? 
                                        (
                                            <Link 
                                                to={`/events/${nextEvent[0]._id}`}
                                                className="dashboard-nav-button fill-green"
                                                onClick={e => setCheckInReady(e, nextEvent[0]._id)}>
                                                    OPEN CHECK-IN
                                            </Link>
                                        ) : (
                                            <Link 
                                                to={`/events/${nextEvent[0]._id}`}
                                                className="dashboard-nav-button fill-red"
                                                onClick={e => setCheckInReady(e, nextEvent[0]._id)}>
                                                    CLOSE CHECK-IN
                                            </Link>
                                        )
                                    }
                                </div>
                            </div>
                        </>
                    ) : (
                        <div>No events coming up!</div>
                    )}

                <div className="dashboard-nav">
                    {events && users ? (
                        <div className="dashboard-nav-row">
                            <button
                                className={`dashboard-nav-button ${events && tabSelected === "events" ? `tab-selected`: ""}`}
                                onClick={e => handleTabSelect(e, "events")}
                            >
                                EVENTS
                            </button>
                            <button
                                className={`dashboard-nav-button ${users && tabSelected === "users" ? `tab-selected`: ""}`}
                                onClick={e => handleTabSelect(e, "users")}
                            >
                                BRIGADE
                            </button>
                        </div>
                    ) : (
                        <div className="dashboard-nav-row block">
                            <button
                                className="dashboard-nav-button"
                            >
                                LOADING...
                            </button>
                            <button
                                className="dashboard-nav-button"
                            >
                                LOADING...
                            </button>
                        </div> 
                    )}

                    {!eventsIsSelected && !usersIsSelected ? (
                        <div className="eventsandusers-container">
                        <h4> ^ Select an option above to get started.</h4>
                        </div>
                    ) : (
                        null
                    )}

                    {tabSelected ? (
                        <div className="plus-sign">
                            +
                        </div>
                    ) : (
                        null
                    )}
                    
                    {eventsIsSelected ? (
                        <div className="dashboard-nav-row">
                            <button 
                                className={`dashboard-nav-button ${events && optionSelected === "left" ? `tab-selected`: ""}`}
                                onClick={e => handleOptionSelect(e, "left")}
                            >
                                UPCOMING
                            </button>
                            <button
                                className={`dashboard-nav-button ${events && optionSelected === "right" ? `tab-selected`: ""}`}
                                onClick={e => handleOptionSelect(e, "right")}
                            >
                                PAST
                            </button>
                        </div>
                    ) : (
                        null
                    )}

                    {usersIsSelected ? (
                        <div className="dashboard-nav-row">
                            <button 
                                className={`dashboard-nav-button ${events && optionSelected === "left" ? `tab-selected`: ""}`}
                                onClick={e => handleOptionSelect(e, "left")}
                            >
                                NAME
                            </button>
                            <button
                                className={`dashboard-nav-button ${events && optionSelected === "right" ? `tab-selected`: ""}`}
                                onClick={e => handleOptionSelect(e, "right")}
                            >
                                ROLE
                            </button>
                        </div>
                    ) : (
                        null
                    )}
                </div>
                

                {eventsIsSelected ? (
                    <div className="eventsandusers-container">
                        <DashboardEvents />
                    </div> 
                ) : (
                    null
                )}

                {usersIsSelected ? (
                    <div className="eventsandusers-container">
                        <DashboardUsers />
                    </div> 
                ) : (
                    null
                )}
            </div>
        </div>
        ) : (
            <Redirect to="/login" />
        )
    )
};

export default AdminDashboard;
    