import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

import ReadyEvents from '../components/ReadyEvents';

// import '../sass/EventContainer.scss';
// import '../sass/EventContainer-media-queries.scss';

const NewUser = (props) => {
    const [newUser] = useState(true);

    useEffect(() => {

    }, []);

    return (
        <div className="flex-container">
            <div className="new">
                <div className="new-headers">
                    <h3>Welcome!</h3>
                    <h4>Thanks for coming.</h4>

                    <ReadyEvents newUser={newUser}/>
                </div>
            </div>
        </div>
    )
};

export default NewUser; 