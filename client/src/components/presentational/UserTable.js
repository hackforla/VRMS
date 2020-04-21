import React from 'react';


const UserTable = (props) => {
    const data = {
        name: "John Smith",
        email: "john.smith@test.com",
        github: "www.github.com/j_smith",
        slack: "www.slack.com/j_smith",
        desiredRoles: ["UX","Front End"],
        hackNights: ["DTLA", "Westside"],
        availability: ["Mon PM", "Thurs PM"]
    }
    return (
        <table className="user-data">
            <tbody>
    <tr><th className="user-data__header">Name</th><td className="user-data__info user-data">{data.name}</td></tr>
    <tr><th className="user-data__header">Email</th><td className="user-data__info">{data.email}</td></tr>
    <tr>
        <th className="user-data__header">Github</th>
        <td className="user-data__info">{data.github}</td>
    </tr>      
                {data.slack ?    
                    (<tr>
                        <th className="user-data__header">Slack</th>
                        <td className="user-data__info">{data.slack}</td>
                    </tr>):("")}
                {data.desiredRoles && data.desiredRoles.length > 0 ? 
                (<tr><th className="user-data__header">Desired Roles</th><td className="user-data__info user-data__info--flex">
                    {data.desiredRoles.map((role, index)=> (<p key={index} className="user-data__selection"><span>{role}</span><button className="user-data__delete">X</button></p>))}
                </td></tr>):("")}
                <tr><th className="user-data__header">My Hack Nights</th><td class="user-data__info user-data__info--flex">
                    <p className="user-data__selection"><span>DTLA</span><button className="user-data__delete">X</button></p>
                    <p className="user-data__selection"><span>Westside</span><button className="user-data__delete">X</button></p>
                </td></tr>
                <tr><th className="user-data__header">Availability</th><td class="user-data__info user-data__info--flex">
                    <p className="user-data__selection"><span>Mon PM</span><button className="user-data__delete">X</button></p>
                    <p className="user-data__selection"><span>Thurs PM</span><button className="user-data__delete">X</button></p>  
                </td></tr>
            </tbody>
        </table>
    )
}

export default UserTable;