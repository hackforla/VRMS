import React, { Fragment } from 'react';
import styles from '../../sass/ProjectLeaderDashboard.module.scss';

const RosterTableRow = ({
  name,
  role,
  isNewMember,
  gDriveClicked,
  gitHubClicked,
  services,
}) => {
  // see icons attr. note @ bottom
  const checkmark = (
    <img
      className={styles.rosterIconImg}
      src="/projectleaderdashboard/check.png"
      alt="checkmark"
    />
  );
  const gitHubIcon = (
    <img
      className={styles.rosterIconImg}
      src="/projectleaderdashboard/github.png"
      alt="GitHub Icon"
    />
  );
  const googleDriveIcon = (
    <img
      className={styles.rosterIconImg}
      src="/projectleaderdashboard/googledrive.png"
      alt="Google Drive Icon"
      onClick={() => {
        gDriveClicked();
      }}
    />
  );

  const slackIcon = (
    <img
      className={styles.rosterIconImg}
      src="/projectleaderdashboard/slack.png"
      alt="Slack Icon"
    />
  );

  let here = (
    <div className={styles.rosterIconContainer}>
      <div className={styles.rosterIcon}>{slackIcon}</div>
      {services.googleDrive ? (
        <div className={styles.rosterIcon}>{checkmark}</div>
      ) : (
        <div className={styles.rosterIcon}>{googleDriveIcon}</div>
      )}
      {services.gitHub ? (
        <div className={styles.rosterIcon}>{checkmark}</div>
      ) : (
        <div className={styles.rosterIcon}>{gitHubIcon}</div>
      )}
    </div>
  );

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
