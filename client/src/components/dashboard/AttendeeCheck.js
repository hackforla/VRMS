import React from "react";
import styles from "../../sass/ProjectManagerDashboard.module.scss";

const AttendeeCheck = ({ firstName, lastName }) => {
    return (
        <span className={styles.checklistPerson}>
            {firstName + " " + lastName}
        </span>
    );
};

export default AttendeeCheck;
