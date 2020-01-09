import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';

import DashboardEvents from '../components/DashboardEvents';

const AdminDashboard = (props) => {

    useEffect(() => {
        // fetchData();

    }, []);

    return (
        <div className="flex-container">
            <div className="dashboard">
                <div className="events">
                    <h3>Your Events:</h3>
                    <DashboardEvents />
                </div>
            </div>
        </div>
    )
};

export default AdminDashboard;
    