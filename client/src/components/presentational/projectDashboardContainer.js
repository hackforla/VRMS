import React from "react";
import { ReactComponent as ClockIcon } from "../../svg/Icon_Clock.svg";
import { ReactComponent as LocationIcon } from "../../svg/Icon_Location.svg";
import { Link } from "react-router-dom";

import moment from "moment";

const projectDashboardContainer = (props) => {
  return (
    <div>
      <Link
        className="checkin-toggle fill-green"
        onClick={() => {
          props.changeTable(true);
        }}
        // onClick={(e) => props.setCheckInReady(e, props.nextEvent[0]._id)}
      >
        Attendees
      </Link>
      <Link
        className="checkin-toggle fill-green"
        onClick={() => {
          props.changeTable(false);
        }}
        // onClick={(e) => props.setCheckInReady(e, props.nextEvent[0]._id)}
      >
        Roster
      </Link>
    </div>
  );
};
export default projectDashboardContainer;
