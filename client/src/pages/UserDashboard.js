import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';

const UserDashboard = (props) => {

    useEffect(() => {
        // fetchData();

    }, []);

    return (
        <div className="flex-container">
            <div className="dashboard">
                <h3>Your Volunteer Journey</h3>
                <div className="events">
                    Profile
                </div>
                <div className="events">
                    Events
                </div>
            </div>
        </div>
    )
};

export default UserDashboard;
    