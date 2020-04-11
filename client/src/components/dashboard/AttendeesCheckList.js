import React from "react";
import styles from "../../sass/ProjectLeaderDashboard.module.scss";
import AttendeeCheck from "./AttendeeCheck";

const AttendeesCheckList = ({ attendees }) => {
    return (
        <ul className={styles.checklist}>
            {attendees.map((attendee) => (
                <li key={Math.random()}>
                    <AttendeeCheck
                        firstName={attendee.userId.name.firstName}
                        lastName={attendee.userId.name.lastName}
                    ></AttendeeCheck>
                </li>
            ))}
        </ul>
    );
};

export default AttendeesCheckList;
