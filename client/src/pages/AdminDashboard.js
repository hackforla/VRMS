import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

import DashboardEvents from '../components/DashboardEvents';

import '../sass/Dashboard.scss';

const AdminDashboard = (props) => {
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);
    const [tabSelected, setTabSelected] = useState("events");

    useEffect(() => {
        // fetchData();

    }, []);

    return (
        <div className="flex-container">
            <div className="dashboard">
                {/* <div className="dashboard-nav">
                    {events && users ? (
                        <div className="dashboard-nav-row">
                            <button>
                                Events
                            </button>
                            <button>
                                Users
                            </button>
                        </div>
                    ) : (
                        <div className="dashboard-nav-row block">
                            <button>
                                Loading...
                            </button>
                            <button>
                                Loading...
                            </button>
                        </div> 
                    )}
                    
                    {eventsIsSelected ? (
                        <div className="dashboard-nav-row">
                            <button>
                                Upcoming
                            </button>
                            <button>
                                Past
                            </button>
                        </div>
                    ) : (
                        null
                    )}

                    {usersIsSelected ? (
                        <div className="dashboard-nav-row">

                        </div>
                    ) : (
                        null
                    )}
                   
                    <div key={`${event._id}-${index}`} className="home-buttons">
                        
                    </div>
                </div> */}
                <div className="events">
                    <h3>Your Events:</h3>
                    <DashboardEvents />
                </div>
            </div>
        </div>
    )
};

export default AdminDashboard;
    