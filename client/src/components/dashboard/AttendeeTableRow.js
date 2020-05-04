import React, { Fragment } from "react";
import styles from "../../sass/ProjectLeaderDashboard.module.scss";
import DashboardButton from "./DashboardButton";

const AttendeeTableRow = ({ name, role, isNewMember, present }) => {
    let here = null;
    if (isNewMember) {
        here = <DashboardButton>Start Onboard</DashboardButton>;
    } else {
        if (present) {
            here = (
                <span className={[styles.attendeeTableText, styles.yesColor].join(" ")}>
                    Yes
                </span>
            );
        } else {
            here = (
                <span className={[styles.attendeeTableText, styles.noColor].join(" ")}>
                    No
                </span>
            );
        }
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
