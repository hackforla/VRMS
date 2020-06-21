import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


import '../../sass/Home.scss';

const CreateNewProfileButton = (props) => {
    // console.log(props.events);

    return (
        <Link 
            to={`/newProfile`} 
            className={`home-button new-profile-button`}>
                CREATE NEW PROFILE
        </Link>
    )
};

export default CreateNewProfileButton;
    