import React, { useState, useEffect } from 'react';

import ReadyEvents from '../components/ReadyEvents';

// import '../sass/HomeContainer.scss';
// import '../sass/HomeContainer-media-queries.scss';

const ReturningUser = (props) => {
    const [returningUser] = useState(true);

    useEffect(() => {

    }, []);

    return (
        <div className="flex-container">
            <div className="returning">
                <div className="returning-headers">
                    <h3>Welcome Back!</h3>
                    <h4>We're happy to see you</h4>

                    <ReadyEvents returningUser={returningUser}/>
                </div>
                
                
            </div>
        </div>
    )
};

export default ReturningUser;
    