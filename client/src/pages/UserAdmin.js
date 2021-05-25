import React, { useState, useEffect } from 'react';
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
    const [searchResultType, setSearchResultType] = useState("name"); // Which results will diplay

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
            console.log(`fetchUsers error: ${error}`);
            alert("Server not responding.  Please refresh the page.");
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
            console.log(`fetchProjects error: ${error}`);
            alert("Server not responding.  Please refresh the page.");
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
        (user => user.email.toLowerCase().startsWith(searchTerm.toLowerCase().trim()))
        .sort((a,b) => a.email.localeCompare(b.email))
        .map((u) => <div onClick={userClickHandler(u)}>{u.email + " ( " + u.name.firstName + " " + u.name.lastName + " )"}</div>)      
    ;
    
    const nameResults = !searchTerm
    ? []
    : Object.values(users).filter 
        (user => 
            user.name.firstName.concat(' ', user.name.lastName).toLowerCase().startsWith(searchTerm.toLowerCase().trim()))
            .sort((a,b) => a.name.firstName.concat(a.name.lastName).localeCompare(b.name.firstName.concat(b.name.lastName)))
            .map((u) => <div onClick={userClickHandler(u)}>{u.name.firstName + " " + u.name.lastName + " ( " + u.email + " )"}</div>)
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

        // Renaming variable so it matches db name
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
            console.log(`update user error: `, error);
            alert("Server not responding.  Please try again.");
        }

    }

    // This updates the users in the database whenever userManagedProjects updates
    useEffect(() => {
        if (userLoaded) {
          updateUserDb();
          fetchUsers(); // Fetches users from db and resets users state.  On the off chance that there is a problem with db write, this will align state with db 
        } else {
          setUserLoaded(true);
        }
      }, [userManagedProjects]);


    // Handle the add project form submit
    const handleProjectFormSubmit = async (event) => {
        event.preventDefault();

        // If there is a value, and it's not already in state, add to state, which will trigger db update (see useEffect above) 
        if (projectValue.length > 0 && projectValue != 'default' && !userManagedProjects.includes(projectValue)) {
            setUserManagedProjects([...userManagedProjects, projectValue]);
            setProjectValue([]);
        } else {
            setProjectValue([]);
        }
    };

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

    // Swaps the buttons and displayed panels for the search results, by email or by name
    const buttonSwap = () => {
        searchResultType === "email" 
        ? setSearchResultType('name') 
        : setSearchResultType('email');
    };

    // If there is a selected user, show the edit form; else show search form
    if (Object.keys(userToEdit).length === 0) {
        return (
            <div className="container--usermanagement">
                <div>
                    <h3>User Management</h3>
                    <input
                        type="text"
                        placeholder="Search by name and email..."
                        value={searchTerm}
                        onChange={handleChange}
                    />
                    <div className="tab-buttons">
                        <div><button 
                            className={searchResultType === "name" ? "select-button selected" : "select-button"} 
                            onClick={buttonSwap} disabled={searchResultType === "name"}>Results by Name
                        </button></div>
                        <div><button 
                            className={searchResultType === "email" ? "select-button selected" : "select-button"} 
                            onClick={buttonSwap} disabled={searchResultType === "email"}>Results by Email
                        </button></div>
                    </div>
                    <div>
                        <div>
                            {<ul className={searchResultType === "name" ? "search-results" : "search-results hide-results"}>    
                                {nameResults.map((result,index) => {
                                return (
                                    <li key={index}>{result}</li>
                                )})}
                            </ul>}
                        </div> 

                        <div>
                            {<ul className={searchResultType === "email" ? "search-results" : "search-results hide-results"}>
                                {emailResults.map((result,index) => {
                                return (
                                    <li key={index}>{result}</li>
                                )})}
                            </ul>}
                        </div> 
                    </div>
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

    // Handle change on input
    const handleChange = event => {
        props.setProjectValue(event.target.value);
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
            <div className="ua-row">
                <div className="user-display-column-left">
                    Name: 
                </div>
                <div className="user-display-column-right">
                    {userName} 
                </div>
            </div>
            <div className="ua-row">
                <div className="user-display-column-left">
                    Email: 
                </div>
                <div className="user-display-column-right">
                    {userEmail}
                </div>
            </div>
            <div className="ua-row">
                <div className="user-display-column-left">
                    Projects: 
                </div>
                <div className="user-display-column-right">
                    <ul className="project-list">    
                        {userProjectsToDisplay.map((result,index) => {
                        return (
                            <li key={index}>{result[1]}
                            <button className="button-remove" onClick={() => props.handleRemoveProject(result[0])}>(remove)</button>
                            </li>
                        )})}
                    </ul>
                </div>
            </div>
            <div>
                {<form onSubmit={props.handleFormSubmit}>
                    <select 
                        className="project-select"
                        value={props.projectValue} 
                        onChange={handleChange}>
                            <option  value='default'>Select a project..</option>
                            {props.activeProjects.map((result,index) => {
                            return (
                                <option key={index} value={result[0]}>{result[1]}</option>
                            )})}
                        </select>
                        <button className="button-add" type="submit">Add project</button>
                </form>}
                <div><button className="button-back" onClick={cancelEdit}>Back to search</button></div>
            </div>
        </div>
    )
};


// Export UserAdmin
export default UserAdmin;
