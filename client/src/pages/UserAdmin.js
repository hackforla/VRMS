import React, { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom'
//import Select from 'react-select';
import '../sass/UserAdmin.scss';

//Parent
const UserAdmin = () => {
    
    const headerToSend = process.env.REACT_APP_CUSTOM_REQUEST_HEADER;

    // Initialize hooks
    const [users, setUsers] = useState([]); // All users pulled from database
    const [projects, setProjects] = useState([]); // All projects pulled from db
    const [userToEdit, setUserToEdit] = useState({}); // The selected user that is being edited
    const [userManagedProjects, setUserManagedProjects] = useState([]); //  The projects that the selected user is asigned
    const [searchTerm, setSearchTerm] = useState(""); // Serch term for the user/email search
    const [projectValue, setProjectValue] = useState("");  // State and handler for form in EditUsers
    const [userLoaded, setUserLoaded] = useState(false);  // is a user currently loaded

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

    // Handle click on selected user in search results
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

    // Filter active projects for dropdown
    const activeProjects = Object.values(projects).filter (project => project.projectStatus === 'Active')
    .map((p) => [p._id, p.name])
    ;

    // Handle change on input in search form
    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    // Updates user projects in db
    const updateUserDb = async () => {

        // // renaming variable so it matches db name
        let managedProjects = userManagedProjects;

        // // Update database
        const url = `/api/users/${userToEdit._id}`;
        const requestOptions = {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "x-customrequired-header": headerToSend
            },
            body: JSON.stringify({ managedProjects })
        };

        try {
            const response = await fetch(url, requestOptions); 
            const resJson = await response.json();
            return resJson;
        } catch (error) {
            console.log(error);
        }

    }

    // This updates the users in the database whenever userManagedProjects updates
    useEffect(() => {
        if (userLoaded) {
          updateUserDb();
        } else {
          setUserLoaded(true);
        }
      }, [userManagedProjects]);


    // Handle the add project form submit
    const handleProjectFormSubmit = async (event) => {
        event.preventDefault();

        // If there is a value, and it's not already in state, then add to state, which will 
        // trigger db update (see useEffect above) 
        if (projectValue.length > 0 && projectValue != 'default' && !userManagedProjects.includes(projectValue)) {
            setUserManagedProjects([...userManagedProjects, projectValue]);
            setProjectValue([]);
        } else {
            setProjectValue([]);
        }
    };

    // Model for asynch fetch createRecurringEvents.js

    // Handle cancel form and return to search
    const handleProjectFormCancel = () => {
        setUserLoaded(false);
        setUserToEdit({});
        setSearchTerm("");
        setUserManagedProjects([]);
    };
    
    // Remove projects from db
    const handleRemoveProject = (projectToRemove) => {
        if (userManagedProjects.length > 0) {
            setUserManagedProjects(userManagedProjects.filter(p => (p !== projectToRemove)));
        } 
    };

    // This initially populates userManagedProjects upon selection of a user
    const handleAddProject = (proj) => {
        setUserManagedProjects(proj);
    }


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
                    activeProjects = {activeProjects}
                    userManagedProjects = {userManagedProjects}
                    handleFormSubmit = {handleProjectFormSubmit}
                    handleFormCancel = {handleProjectFormCancel}
                    handleAddProject = {handleAddProject}
                    handleRemoveProject = {handleRemoveProject}
                    projectValue = {projectValue}
                    setProjectValue = {setProjectValue}
                />
            </div>
        )
    }
};

// child of UserAdmin. Displays form to update users. 
const EditUsers = (props) => {

    // // State and handler for form
    // const [projectValue, setProjectValue] = useState("");

    // Handle change on input
    const handleChange = event => {
        props.setProjectValue(event.target.value);
        //console.log(`target value: `, event.target.value);
    };

    // Prepare data for display
    const userName = props.userToEdit.name?.firstName + " " + props.userToEdit.name?.lastName;
    const userEmail = props.userToEdit.email;
    const userProjects = props.userManagedProjects || [];


    //Processing
    const cancelEdit = () => {
        props.handleFormCancel();
    }

    // add user projects to state
    useEffect(() => {
        //props.handleAddProject(userProjects);
        props.handleAddProject(props.userToEdit.managedProjects);
    }, []);

    // Prepare user projects for display by connecting the ID with the project name
    function prepareUserProjects (userProjects, activeProjects ) {
        let res = activeProjects.filter(item => userProjects.includes(item[0]));
        return res;
    } 

    const userProjectsToDisplay = prepareUserProjects (userProjects, props.activeProjects);

    return (
        <div>
            <div>Name: {userName}</div>
            <div>Email: {userEmail}</div> 
            <div>Projects: 
                <ul className="project-list">    
                    {userProjectsToDisplay.map((result,index) => {
                    return (
                        <li key={index}>{result[1]}
                        <button onClick={() => props.handleRemoveProject(result[0])}>(remove)</button>
                        </li>
                    )})}
                </ul>
            </div>
            <div>
                {<form onSubmit={props.handleFormSubmit}>
                    <select 
                        value={props.projectValue} 
                        onChange={handleChange}>
                            <option  value='default'>Select a project..</option>
                            {props.activeProjects.map((result,index) => {
                            return (
                                <option key={index} value={result[0]}>{result[1]}</option>
                            )})}
                        </select>
                        <button type="submit">Submit</button>
                    {/*<button onClick={props.handleFormSubmit}>Add a project</button> */}
                </form>}
                <div><button onClick={cancelEdit}>Cancel</button></div>
            </div>
        </div>
    )
};

// Export UserAdmin
export default UserAdmin;