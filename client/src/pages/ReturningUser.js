import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

import SelectCheckIn from '../components/SelectCheckIn';

// import '../sass/HomeContainer.scss';
// import '../sass/HomeContainer-media-queries.scss';

const ReturningUser = (props) => {
    // const [isLoading, setIsLoading] = useState(false);
    // const [event, setEvent] = useState([]);
    // const [isError, setIsError] = useState(null);
    const [returningUser, setNewUser] = useState(true);


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
            <div className="returning">
                <div className="returning-headers">
                    <h3>Welcome Back!</h3>
                    <h4>We're happy to see you</h4>

                    <SelectCheckIn returningUser={returningUser}/>
                </div>
                
                
            </div>
        </div>
    )
};

export default ReturningUser;
    