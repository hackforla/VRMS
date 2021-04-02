import React, { useState, useEffect } from 'react';
import '../sass/UserManagement.scss'

const UserAdmin = (props) => {
    
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

    // Initialize hooks
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Get users email into useable array (TEMP)
    const userArray = [];
    for (let us of users) {
        //let fullName = us.name.firstName.concat(`${" "}us.name.lastName`);
        userArray.push(us.email);
    }
    
    // Handle change on input
    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

   // Set search results 
    const results = !searchTerm
    ? []
    : userArray.filter(user =>
        user.toLowerCase().startsWith(searchTerm.trim())
        );

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
                <ul>    
                    {results.map(item => (
                    <li>{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
};

export default UserAdmin;
    