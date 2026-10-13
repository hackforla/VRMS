import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser ] = useState({
        name: "John Smith",
        email: "john.smith@test.com",
        github: "www.github.com/j_smith",
        slack: "www.slack.com/j_smith",
        desiredRoles: ["UX","Front End"],
        hackNights: ["DTLA", "Westside"],
        availability: ["Mon PM", "Thurs PM"]
    });

    // eslint-disable-next-line no-unused-vars
    const [events, setEvents] = useState([
        {
            name: "VRMS Team Meeting",
            time: "04/13, 7PM",
            url: ""
        }
    ]);

    // eslint-disable-next-line no-unused-vars
    const [teams, setTeams ] = useState([
        {
            name: 'VRMS',
            status: 'Active'
        },
        {
            name: 'Where2Vote2018',
            status: 'Inactive'
        }
    ])

    const removeOption = (category, optionToRemove) => {
        const updatedUser = { ...user }
        updatedUser[category] = user[category].filter(option => option !== optionToRemove);
        setUser(updatedUser);
    }

    return (
        <UserContext.Provider value={{ user, events, teams, removeOption }}>
            { children }
        </UserContext.Provider>
    );
};

