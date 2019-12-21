import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

import SelectCheckIn from '../components/SelectCheckIn';

// import '../sass/EventContainer.scss';
// import '../sass/EventContainer-media-queries.scss';

const NewUser = (props) => {
    // const [isLoading, setIsLoading] = useState(false);
    // const [event, setEvent] = useState([]);
    // const [isError, setIsError] = useState(null);
    const [newUser, setNewUser] = useState(true);

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
            <div className="new">
                <div className="new-headers">
                    <h3>Welcome!</h3>
                    <h4>Thanks for coming.</h4>

                    <SelectCheckIn newUser={newUser}/>
                </div>
            </div>
        </div>
    )
};

export default NewUser; 