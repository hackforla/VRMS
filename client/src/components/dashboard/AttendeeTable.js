import React, { useState, useEffect } from "react";
import styles from "../../sass/ProjectLeaderDashboard.module.scss";
import AttendeeTableRow from "./AttendeeTableRow";
import ls from "local-storage";

const AttendeeTable = ({ attendees, activeMeeting, projectId, setRoster, roster }) => {
    console.log('ATTENDEETABLE ATTENDEES', attendees);

    const [sortedAttendees, setSortedAttendees] = useState(null);
    
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

    function sortAttendees() {
        if (!attendees.length || !roster.length) return;

        const attendeesOnRoster = [];
        const attendeesNotOnRoster = []; 
              
        attendees.map((attendee, index) => {
            const currAttendee = { ...attendee };
      
            const isOnRoster = Boolean(roster.find(teamMember => 
              teamMember.userId._id === attendee.userId._id));
            
            currAttendee.isOnRoster = isOnRoster;
            isOnRoster 
                ? attendeesOnRoster.push(currAttendee) 
                : attendeesNotOnRoster.push(currAttendee)
            ;
        });
      
        setSortedAttendees({
            onTeam: attendeesOnRoster,
            notOnTeam: attendeesNotOnRoster,
        });
    }

    useEffect(() => {
        sortAttendees();
    }, [attendees, roster]);

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

            {sortedAttendees && (
                sortedAttendees.notOnTeam.map((attendee) => {
                    console.log({attendee});
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
                })
            )}

            {sortedAttendees && (
                sortedAttendees.onTeam.map((attendee) => {
                    console.log({attendee});
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
            )}
        </div>
    );
};

export default AttendeeTable;
