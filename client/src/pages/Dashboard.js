import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import DashboardEvents from '../components/DashboardEvents';

const Dashboard = (props) => {
    // const [isLoading, setIsLoading] = useState(false);
    // const [event, setEvent] = useState([]);
    // const [isError, setIsError] = useState(null);

    // async function fetchData() {
    //     try {
    //         const res = await fetch(`http://localhost:4000/api/events/${props.match.params.id}`);
    //         const resJson = await res.json();
    //         setEvent(resJson);
    //     } catch(error) {
    //         setIsError(error);
    //         alert(error);
    //     }
    // }

    useEffect(() => {
        // fetchData();

    }, []);

    return (
        <div className="flex-container">
            <div className="dashboard">
                <div className="events">
                    <DashboardEvents />
                </div>
            </div>
        </div>
    )
};

export default Dashboard;
    