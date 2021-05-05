import React from "react";
import { Link } from "react-router-dom";

import "../../sass/Home.scss";

const CheckInButtons = (props) => {
  return (
    <>
      <Link
        to={`/checkIn/returningUser?eventId=${props.event}`}
        className={`home-button ${props.disabled && "disabled"}`}
      >
        CHECK IN AS RETURNING USER
      </Link>
      <Link
        to={`/checkIn/newUser?eventId=${props.event}`}
        className={`home-button`}
      >
        CHECK IN AS NEW USER
      </Link>
     
      {props.events.length > 1 && (
        <Link to={`/newProfile`} className={`home-button-light`}>
          ...OR CREATE A NEW PROFILE
        </Link>
      )}
    </>
  );
};

export default CheckInButtons;
