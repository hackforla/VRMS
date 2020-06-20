import React, { Fragment } from "react";
import styles from "../../sass/ProjectLeaderDashboard.module.scss";
import DashboardButton from "./DashboardButton";
import ls from "local-storage";

const RosterTableRow = ({ name, role, isNewMember, gDriveClicked, gitHubClicked, services}) => {
    // see icons attr. note @ bottom
    const checkmark = <img src="/projectleaderdashboard/check.png" alt="checkmark" />
    const gitHubIcon = <img src="/projectleaderdashboard/github.png" alt="GitHub Icon" />
    const googleDriveIcon = <img src="/projectleaderdashboard/googledrive.png" alt="Google Drive Icon" />
    const slackIcon = <img src="/projectleaderdashboard/slack.png" alt="Slack Icon" />

    let here = null;

    if (isNewMember) {
      here = (
        <>
            {services.gitHub ? checkmark : <DashboardButton clicked={gitHubClicked}>{gitHubIcon}</DashboardButton>}
            {services.googleDrive ? checkmark : <DashboardButton clicked={gDriveClicked}>{googleDriveIcon}</DashboardButton>}
            <DashboardButton>{slackIcon}</DashboardButton>
        </>
      );
    } else {
      here = (
        <>
            {services.gitHub ? checkmark : <DashboardButton clicked={gitHubClicked}>{gitHubIcon}</DashboardButton>}
            {services.googleDrive ? checkmark : <DashboardButton clicked={gDriveClicked}>{googleDriveIcon}</DashboardButton>}
            {/* <DashboardButton>{slackIcon}</DashboardButton> */}
            {checkmark}
        </>
      );
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

export default RosterTableRow;


// will eventually need to attribute icons:
//  checkmark 
//  Icons made by <a href="https://www.flaticon.com/authors/kiranshastry"
//  title="Kiranshastry">Kiranshastry</a> from <a
//  href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
// Google Drive
// Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>