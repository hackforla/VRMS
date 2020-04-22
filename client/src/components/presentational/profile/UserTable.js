import React from 'react';
import ProfileOption from '../profile/ProfileOption';

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

    const handleRemoveOption = (category, option) => {
        data[category] = data[category].filter(catOption => catOption !== option);
    }

    return (
        <table className="user-data">
            <tbody>
                <tr>
                    <th className="user-data__header">Name</th>
                    <td className="user-data__info user-data">{data.name}</td>
                </tr>
                <tr>
                    <th className="user-data__header">Email</th>
                    <td className="user-data__info">{data.email}</td>
                </tr>
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
                (<tr>
                    <th className="user-data__header">Desired Roles</th>
                    <td className="user-data__info user-data__info--flex">
                    {data.desiredRoles.map((option, index)=> (<ProfileOption key={index} option={option} removeOption={()=>handleRemoveOption("desiredRoles", option)}/>))}
                </td>
                </tr>):("")}
                {data.hackNights && data.hackNights.length > 0 ? 
                (<tr>
                    <th className="user-data__header">My Hack Nights</th>
                    <td className="user-data__info user-data__info--flex">
                        {data.hackNights.map((option, index)=>(<ProfileOption key={index} option={option} removeOption={()=>handleRemoveOption("hackNights", option)}/>))}
                    </td>
                </tr>):("")}
                {data.availability && data.availability.length > 0 ? 
                (<tr>
                    <th className="user-data__header">Availability</th>
                    <td className="user-data__info user-data__info--flex">
                        {data.availability.map((option, index)=>(<ProfileOption key={index} option={option} removeOption={()=>handleRemoveOption("availability", option)}/>))}
                    </td>
                </tr>):("")}
            </tbody>
        </table>
    )
}

export default UserTable;