import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
//import Select from 'react-select';
import '../sass/UserAdmin.scss';

//Parent
const UserAdmin = (props) => {
    
    const headerToSend = process.env.REACT_APP_CUSTOM_REQUEST_HEADER;

    // Initialize hooks
    const [users, setUsers] = useState([]);
    const [userToEdit, setUserToEdit] = useState({});
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    //functions to handle various things

    const handleProjectFormSubmit = () => {
        console.log("form submitted");
    };

    const handleProjectFormCancel = () => {
        setUserToEdit({});
        setSearchTerm("");
    };
    

    // Fetch users from db
    async function fetchUsers() {
        try {
            const res = await fetch("/api/users/", {
                headers: {
                    "x-customrequired-header": headerToSend
                  }
            });
            const resJson = await res.json();
            setUsers(resJson);

        } catch(error) {
            alert(`fetchUsers ${error}`);
        }
    }

    // Fetch projects from db
    async function fetchProjects() {
        try {
            const res = await fetch("/api/projects/", {
                headers: {
                    "x-customrequired-header": headerToSend
                    }
            });
            const resJson = await res.json();
            setProjects(resJson);

        } catch(error) {
            alert(`fetchProjects: ${error}`);
        }
    }

    useEffect(() => {
        fetchUsers();
        fetchProjects();
    }, []);


    // // Fetch single user from db
    // async function fetchUserToEdit() {
    //     try {
    //         const res = await fetch(`/api/users/${props.match.params.id}`, {
    //             headers: {
    //                 "x-customrequired-header": headerToSend
    //                 }
    //         });
    //         const resJson = await res.json();
    //         setUserToEdit(resJson);

    //     } catch(error) {
    //         alert(`fetchUserToEdit: ${error}`);
    //     }
    // }

    // useEffect( () => {
    //     if (props.match.params.id) {
    //         fetchUserToEdit();
    //     }
    // }, [])

    // Filter projects for dropdown
    const dropdownProjects = Object.values(projects).filter (project => project.projectStatus === 'Active')
            .map((p) => [p.name, p._id])
    ;

    // Handle change on input
    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    const userClickHandler = usr => event => {
        setUserToEdit(usr);
    }

    // Get search resuts to display on page
    const emailResults = !searchTerm
    ? []
    : Object.values(users).filter 
        (user => user.email.toLowerCase().startsWith(searchTerm.trim()))
        .map((u) => <div onClick={userClickHandler(u)}>{u.email + "(" + u.name.firstName + " " + u.name.lastName + ")"}</div>)      
    ;

    const nameResults = !searchTerm
    ? []
    : Object.values(users).filter 
        (user => 
            user.name.firstName.toLowerCase().startsWith(searchTerm.trim()))      
            .map((u) => <div onClick={userClickHandler(u)}>{u.name.firstName + " " + u.name.lastName + "(" + u.email + ")"}</div>)
    ;

    // If there is a selected user, show the edit form; else show search form
    if (Object.keys(userToEdit).length === 0) {
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
                    {<ul className="search-results">    
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
            </div>
        )
    } else {
        return (
            <div className="edit-users">
                <EditUsers
                    userToEdit = {userToEdit}
                    dropdownProjects = {dropdownProjects}
                    handleProjectFormSubmit = {handleProjectFormSubmit}
                    handleFormCancel = {handleProjectFormCancel}
                />
            </div>
        )
    }
};

// child of UserAdmin. Displays form to update users. 
const EditUsers = (props) => {

    // State and handler for form
    const [projectValue, setProjectValue] = useState("");

    // Handle change on input
    const handleChange = event => {
        setProjectValue(event.target.value);
    };

    // Prepare data for display
    const userName = props.userToEdit.name?.firstName + " " + props.userToEdit.name?.lastName;
    const userEmail = props.userToEdit.email;
    const userProjects = props.userToEdit.managedProjects;
    
    // Filter the projects to get the names of the user projects
    function prepareUserProjects (userProjects, activeProjects ) {
        let res = activeProjects.filter(item => userProjects.includes(item[1]));
        return res;
    } 
    const userProjectsToDisplay = prepareUserProjects (userProjects, props.dropdownProjects);

    //Processing
    const cancelUser = () => {
        props.handleFormCancel();
    }

    return (
        <div>
            <div>Name: {userName}</div>
            <div>Email: {userEmail}</div> 
            <div>Projects: 
                <ul className="project-list">    
                    {userProjectsToDisplay.map((result,index) => {
                    return (
                        <li key={index}>{result[0]}</li>
                    )})}
                </ul>
            </div>
            <div>
                {<form>
                    <select value={projectValue} onChange={handleChange}>
                            <option  value='default'>Select a project..</option>
                            {props.dropdownProjects.map((result,index) => {
                            return (
                                <option key={index} value={result[1]}>{result[0]}</option>
                            )})}
                        </select>
                    <button onClick={props.handleProjectFormSubmit}>Add a project</button>
                </form>}
                <div><button onClick={cancelUser}>Cancel</button></div>
            </div>
        </div>
    )
};

// Export UserAdmin
export default UserAdmin;