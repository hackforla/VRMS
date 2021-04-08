import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../sass/UserAdmin.scss'

// child of UserAdmin. Displays form to update users. 
const EditUsers = (props) => {
    
    
    return (
        <div>Hello World!</div>
    )

};

//Parent
const UserAdmin = (props) => {
    
    // Initialize hooks
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const headerToSend = process.env.REACT_APP_CUSTOM_REQUEST_HEADER;

    // Fetch users from db
    async function fetchData() {
        try {
            const res = await fetch("/api/users/", {
                headers: {
                    "x-customrequired-header": headerToSend
                  }
            });
            const resJson = await res.json();
            setUsers(resJson);

        } catch(error) {
            alert(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // Handle change on input
    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    const emailResults = !searchTerm
    ? []
    : Object.values(users).filter 
        (user => user.email.toLowerCase().startsWith(searchTerm.trim()))
        .map((u) => <a href={`useradmin/` + u._id}>{u.email + "(" + u.name.firstName + " " + u.name.lastName + ")"}</a>)        
    ;

    const nameResults = !searchTerm
    ? []
    : Object.values(users).filter 
        (user => 
            user.name.firstName.toLowerCase().startsWith(searchTerm.trim()))
            .map((u) => <a href={`useradmin/` + u._id}>{u.name.firstName + " " + u.name.lastName + "(" + u.email + ")"}</a>)        
    ;

    return (
        <div className="Container--UserManagement">
            <div>
                <h3>User Management</h3>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={handleChange}
                />
                {<ul>    
                    {nameResults.map((result,index) => {
                    return (
                        <li key={index}>{result}</li>
                    )})}
                    <li>---</li>
                    {emailResults.map((result,index) => {
                    return (
                        <li key={index}>{result}</li>
                    )})}
                </ul>}
            </div>
            <div className="edit-users">
                <EditUsers>
                    userName = {`David Rubinstein`}
                    userTeams = {[`Food Oasis, BallotNav, HfLA Website`]}
                </EditUsers>
            
            </div>
        </div>
    )
};

export default UserAdmin;
    