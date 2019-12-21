import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';


// import '../sass/HomeContainer.scss';
// import '../sass/HomeContainer-media-queries.scss';

const AdminLogin = (props) => {
    // const [isLoading, setIsLoading] = useState(false);
    // const [event, setEvent] = useState([]);
    // const [isError, setIsError] = useState(null);

    // async function fetchData() {
    //     try {
    //         const res = await fetch(`http://localhost:4000/api/events/${props.match.params.id}`);
    //         const resJson = await res.json();
    //         setEvent(resJson);
    //     } catch(error) {
    //         setIsError(error);
    //         alert(error);
    //     }
    // }

    useEffect(() => {
        // fetchData();

    }, []);

    return (
        <div className="flexcenter-container">
            <div className="adminlogin">
                <div className="adminlogin-headers">
                    <h3>Welcome Back!</h3>
                    <h4>Please login below.</h4>
                </div>
                <div className="adminlogin-buttons">
                    {/* <Link to={'/new'}>New</Link>
                    <Link to={'/returning'}>Returning</Link>
                </div>
                <div className="login-button">
                    <Link to={'/login'}>Login</Link> */}
                </div>
            </div>
        </div>
    )
};

export default AdminLogin;
    