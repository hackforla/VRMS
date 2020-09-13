import React from "react";

import AttendeeTable from "../dashboard/AttendeeTable";
import RosterTable from '../dashboard/RosterTable';

const projectDashboardContainer = (props) => {
  return (
    <div>
      {props.attendeeOrRoster ? (
        <AttendeeTable
          attendees={props.attendees}
          setRoster={props.setRoster}
          roster={props.roster}
          activeMeeting={true}
          projectId={props.projectId}
        ></AttendeeTable>
      ) : (
        <RosterTable
          attendees={props.roster}
          RosterProjectId={props.RosterProjectId}
          activeMeeting={true}
        ></RosterTable>
      )}
    </div>
  );
};
export default projectDashboardContainer;
