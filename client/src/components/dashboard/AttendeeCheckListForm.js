import React from "react";
import styles from "../../sass/ProjectLeaderDashboard.module.scss";
import AttendeeCheck from "./AttendeeCheck";

const AttendeeCheckListForm = ({ attendees }) => {
    return (
        <form className={styles.checklist}>
            {attendees.map((attendee) => {
                return (
                    <div key={Math.random()}>
                        <input type="checkbox"></input>
                        <AttendeeCheck
                            firstName={attendee.userId.name.firstName}
                            lastName={attendee.userId.name.lastName}
                        ></AttendeeCheck>
                    </div>
                );
            })}
        </form>
    );
};

export default AttendeeCheckListForm;
