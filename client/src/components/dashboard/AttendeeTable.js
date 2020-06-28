import React from "react";
import styles from "../../sass/ProjectLeaderDashboard.module.scss";
import AttendeeTableRow from "./AttendeeTableRow";
import ls from "local-storage";

const AttendeeTable = ({ attendees, activeMeeting, projectId, setRoster, roster }) => {
    console.log('ATTENDEETABLE ATTENDEES', attendees);
    
    // when refactoring fetch calls move postUserToProjectTeamMember function to projectLeaderDashboard
    const postUserToProjectTeamMember = async (userId) => {
        try {
            const newProjectTeamMember = {
                userId,
                projectId,
            }

            return await fetch('/api/projectteammembers', {
                method: 'POST',
                body: JSON.stringify(newProjectTeamMember),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(res => !res.ok ? new Error(res.statusText) : res.json() )
                .then(newTeamMember => setRoster(roster.push(newTeamMember)))
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles.attendeeTable}>
            <div className={styles.attendeeTableBoxCenter}>
                <span className={styles.attendeeTableTitle}>name</span>
            </div>
            <div className={styles.attendeeTableBoxCenter}>
                <span className={styles.attendeeTableTitle}>role</span>
            </div>
            <div className={styles.attendeeTableBoxCenter}>
                <span className={styles.attendeeTableTitle}>On Roster</span>
            </div>
            {activeMeeting &&
                attendees
                    .filter((attendee) => {
                        return (
                            attendee.isOnRoster === false
                        );
                    })
                    .map((attendee) => {
                        return (
                            <AttendeeTableRow
                                key={Math.random()}
                                name={
                                    attendee.userId.name.firstName +
                                    " " +
                                    attendee.userId.name.lastName
                                }
                                role={attendee.userId.currentRole}
                                postUser={postUserToProjectTeamMember}
                            ></AttendeeTableRow>
                        );
                    })}
            {activeMeeting &&
                attendees
                    .filter((attendee) => {
                        return (
                            attendee.isOnRoster === true
                        );
                    })
                    .map((attendee) => {
                        return (
                            <AttendeeTableRow
                                key={Math.random()}
                                name={
                                    attendee.userId.name.firstName +
                                    " " +
                                    attendee.userId.name.lastName
                                }
                                isProjectTeamMember={true}
                                role={attendee.userId.currentRole}
                            ></AttendeeTableRow>
                        );
                    })}
            
            {/* {!attendeesAreFormatted &&
                attendees
                .map((attendee) => {
                    return (
                        <AttendeeTableRow
                            key={Math.random()}
                            name={
                                attendee.userId.name.firstName +
                                " " +
                                attendee.userId.name.lastName
                            }
                            isProjectTeamMember={true}
                            role={attendee.userId.currentRole}
                        ></AttendeeTableRow>
                    );
                })
            } */}
        </div>
    );
};

export default AttendeeTable;
