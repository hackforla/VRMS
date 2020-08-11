import React from "react";
import styles from "../../sass/ProjectLeaderDashboard.module.scss";
import RosterTableRow from "./RosterTableRow";
import ls from "local-storage";

const RosterTable = ({ attendees, activeMeeting, RosterProjectId }) => {
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
        gDriveClickHandler();
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

  const slackTestButton = () => {
    fetch("api/slack/findId", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          return res.json().then((res) => {
            throw new Error(res.message);
          });
        }
        return res.json();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const gDriveClickHandler = (email, fileId) => {
    email = email;
    fileId = fileId;
    const bodyObject = {
      email: email,
      file: fileId,
    };
    fetch("api/grantpermission/googleDrive", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyObject),
    })
      .then((res) => {
        if (res.status !== 200) {
          return res.json().then((res) => {
            throw new Error(res.message);
          });
        }
        return res.json();
      })

      .catch((err) => {
        console.log(err);
      });
  };

  const gitHubClickHandler = (
    githubHandle,
    projectName,
    accessLevel = "manager"
  ) => {
    // ******************** pbtag -- allow PL to add githubHandle if not
    // already there
    // if (!githubHandle) {
    // }

    const bodyObject = {
      // temporary placeholder handle + repoName
      handle: "testingphoebe",
      teamName: "vrms", //projectName, no where to pull that from currently, event object doesn't provide project name
      accessLevel,
    };
    fetch("api/grantpermission/gitHub", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyObject),
    })
      .then((res) => {
        if (res.status !== 200) {
          return res.json().then((res) => {
            throw new Error(res.message);
          });
        }
        return res.json();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.attendeeTable}>
      <button
        onClick={() => {
          slackTestButton();
        }}
      >
        SlackTest
      </button>
      <div className={styles.attendeeTableBoxCenter}>
        <span className={styles.attendeeTableTitle}>name</span>
      </div>
      <div className={styles.attendeeTableBoxCenter}>
        <span className={styles.attendeeTableTitle}>role</span>
      </div>
      <div className={styles.attendeeTableBoxCenter}>
        <div className={styles.rosterIconContainer}>
          <div className={styles.rosterIcon}>{slackIcon}</div>
          <div className={styles.rosterIcon}>{googleDriveIcon}</div>
          <div className={styles.rosterIcon}>{gitHubIcon}</div>
        </div>
      </div>
      {/* {attendees &&
        attendees.map((attendee) => {
          return (
            <RosterTableRow
              key={Math.random()}
              name={
                attendee.userId.name.firstName +
                " " +
                attendee.userId.name.lastName
              }
              role={attendee.userId.currentRole}
              email={attendee.userId.email}
              isNewMember={true}
              gDriveClicked={() => {
                gDriveClickHandler(attendee.userId.email, RosterProjectId);
              }}
              gitHubClicked={() =>
                gitHubClickHandler(attendee.userId.githubHandle)
              }
              RosterProjectId={RosterProjectId}
              services={{
                gitHub: attendee.onProjectGithub,
                googleDrive: attendee.onProjectGoogleDrive,
              }}
            ></RosterTableRow>
          );
        })} */}
    </div>
  );
};

export default RosterTable;
