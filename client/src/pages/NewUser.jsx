import React, { useState, useEffect } from 'react';

import ReadyEvents from '../components/ReadyEvents';

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