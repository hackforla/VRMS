import React, { useState, useEffect } from 'react';

import '../sass/DashboardUsers.scss';

const DashboardUsers = (props) => {
    const [users, setUsers] = useState(null);

    async function fetchData() {
        try {
            const res = await fetch("/api/users");
            const resJson = await res.json();
            setUsers(resJson);
        } catch(error) {
            alert(error);
        }
        console.log(users);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flexcenter-container">
            <div className="events-list">
                <ul>
                    {users !== null && users.map((user, index) => (
                        <li key={index}>
                            <div key={index} className="event">
                                <div className="user-name">
                                    <h5>{user.name.firstName} {user.name.lastName}</h5>
                                </div>
                                <div className="user-roles">
                                    <p>Current Role: {user.currentRole}</p>
                                    <p>Desired Role: {user.desiredRole}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
};

export default DashboardUsers;
    