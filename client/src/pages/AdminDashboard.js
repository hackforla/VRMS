import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';

import DashboardEvents from '../components/DashboardEvents';
import DashboardUsers from '../components/DashboardUsers';

import useAuth from '../hooks/useAuth';

import '../sass/Dashboard.scss';

const AdminDashboard = (props) => {
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState([]);
    const [tabSelected, setTabSelected] = useState();
    const [optionSelected, setOptionSelected] = useState("left");
    const [eventsIsSelected, setEventsIsSelected] = useState(false);
    const [usersIsSelected, setUsersIsSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [event, setEvent] = useState([]);
    const [isCheckInReady, setIsCheckInReady] = useState(false);

    const auth = useAuth();

    async function setCheckInReady(e) {
        e.preventDefault();
        
        // try {
        //     // const payload = { checkInReady: true };

        //     await fetch(`/api/events/${props.match.params.id}`, {
        //         method: 'PATCH',
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //         // body: JSON.stringify(payload)
        //     })
        //         .then(response => {
        //             if (response.ok) {
        //                 setEvent(event);
        //                 setIsCheckInReady(!isCheckInReady);
        //             }
        //         });

        // } catch(error) {
        //     // setIsError(error);
        //     setIsLoading(!isLoading);
        // }
    }

    async function isAccessLevelAdmin(e) {
        e.preventDefault();
        
        try {
            const res = await fetch(`/api/users/${props.match.params.id}`);
            const resJson = await res.json();

            setUser(resJson);
        } catch(error) {
            alert(error);
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
        // console.log(`Admin dashboard useffect isLoggedIn: ${isLoggedIn}`);
        console.log(`Admin dashboard says auth is: ${auth.user}`);
        // if(!isLoggedIn) {
        //     props.history.replace("/login");
        // }

    }, []);

    return (
        auth.user ? (
            <div className="flex-container">
            <div className="dashboard">
                <div className="dashboard-headers">
                    <h3>Hi, {auth.user.name.firstName}</h3>
                </div>
            
                <div className="dashboard-warning">
                    <p>You have an event coming up:</p>
                </div>
                
                <div className="warning-event">
                    <div className="warning-event-headers">
                        <h4>HackforLA Westside</h4>
                        <p>Monday, January 20th</p>
                    </div>
                    <div className="warning-event-toggle">
                        {event && isCheckInReady === false ? 
                            (
                                <Link 
                                    // to={`/events/${event._id}`}
                                    className="dashboard-nav-button fill-green"
                                    onClick={e => setCheckInReady(e)}>
                                        OPEN CHECK-IN
                                </Link>
                            ) : (
                                <Link 
                                    // to={`/events/${event._id}`}
                                    className="dashboard-nav-button fill-red"
                                    onClick={e => setCheckInReady(e)}>
                                        CLOSE CHECK-IN
                                </Link>
                            )
                        }
                    </div>
                    
                </div> 
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
    