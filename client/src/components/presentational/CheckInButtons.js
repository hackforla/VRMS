import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

const CheckInButtons = (props) => {
  return (
    <>
      <Button
        component={Link}
        to={`/checkIn/returningUser?eventId=${props.event}`}
        disabled={props.disabled}
        variant="text"
      >
        CHECK IN AS RETURNING USER
      </Button>
      <Button
        component={Link}
        to={`/checkIn/newUser?eventId=${props.event}`}
        disabled={props.disabled}
        variant="text"
      >
        CHECK IN AS NEW USER
      </Button>
     
      {props.events.length > 1 && (
        <Button
          component={Link}
          to={`/newProfile`}
          variant="text"
        >
          CREATE A NEW PROFILE
        </Button>
      )}
    </>
  );
};

export default CheckInButtons;
