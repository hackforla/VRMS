import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


import '../../sass/Home.scss';

const CheckInButtons = (props) => {

    return (
        <>
            <Link 
                to={`/checkIn/newUser?eventId=${props.event}`} 
                className={`home-button ${props.disabled && "disabled"}`}>
                    CHECK IN NEW USER
            </Link>
            <Link 
                to={`/checkIn/returningUser?eventId=${props.event}`} 
                className={`home-button ${props.disabled && "disabled"}`}>
                    CHECK IN RETURNING USER
            </Link>
        </>
    )
};

export default CheckInButtons;
    