import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


import '../../sass/Home.scss';
// import '../sass/Home-media-queries.scss';

const CheckInButtons = (props) => {
    // const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);

    useEffect(() => {

    }, []);

    return (
        <div className="home-buttons">
            <Link 
                to={`/checkIn/newUser?eventId=${props.event}`} 
                className="home-button">
                    CHECK IN NEW USER
            </Link>
            <Link 
                to={`/checkIn/returningUser?eventId=${props.event}`} 
                className="home-button">
                    CHECK IN RETURNING USER
            </Link>
        </div>
    )
};

export default CheckInButtons;
    