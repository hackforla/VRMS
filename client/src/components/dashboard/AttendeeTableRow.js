import React, { Fragment } from "react";
import styles from "../../sass/ProjectLeaderDashboard.module.scss";
import DashboardButton from './DashboardButton';

const AttendeeTableRow = ({ name, role, isProjectTeamMember, postUser }) => {
    let here = null;
    
    if (isProjectTeamMember) {
        here = <span className={[styles.attendeeTableText, styles.yesColor].join(" ")}>Yes</span>
    } else {
        here = <DashboardButton clicked={postUser}>Add To Roster</DashboardButton>
    }

    return (
        <Fragment>
            <div className={styles.attendeeTableBoxLeft}>
                <div className={styles.attendeeTableText}>{name}</div>
            </div>
            <div className={styles.attendeeTableBoxCenter}>
                <span className={styles.attendeeTableText}>{role}</span>
            </div>
            <div className={styles.attendeeTableBoxCenter}>{here}</div>
        </Fragment>
    );
};

export default AttendeeTableRow;
