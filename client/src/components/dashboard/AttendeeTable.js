import React, { useState, useEffect } from "react";
import styles from "../../sass/ProjectLeaderDashboard.module.scss";
import AttendeeTableRow from "./AttendeeTableRow";
import ProjectTeamMemberApi from "../../services/projectTeamMember-api-service";

const AttendeeTable = ({ attendees, activeMeeting, projectId, setRoster, roster }) => {
    console.log('ATTENDEETABLE ATTENDEES', attendees);
    console.log("roster", roster.find(person => person.userId.name.lastName === "test"));
    const [sortedAttendees, setSortedAttendees] = useState(null);

    const addToRoster = async (userId, index) => {
        const newMember = {
            userId,
            projectId,
        };

        await ProjectTeamMemberApi.postMember(newMember)
            .then(newTeamMember => {
                // Create a deep copy of the roster and add the new member...
                const newRoster = roster.map(object => {
                    return {...object}
                });

                newTeamMember.userId = sortedAttendees.notOnTeam[index].userId;
                console.log({newTeamMember});
                newRoster.push(newTeamMember);
                console.log({newRoster});
                // ... so that you're able to update the state in a way that
                // triggers a rerender
                setRoster(newRoster);
                console.log("ok i ran");
            })
            .catch(error => console.log(error));
    };
    
    useEffect(() => {
        function sortAttendees() {
            if (!attendees.length || !roster.length) return;
    
            const attendeesOnRoster = [];
            const attendeesNotOnRoster = []; 
                  
            attendees.forEach((attendee) => {
              const currAttendee = { ...attendee };
    
              const isOnRoster = Boolean(
                roster.find(
                  (teamMember) => teamMember.userId._id === attendee.userId._id
                )
              );
    
              currAttendee.isOnRoster = isOnRoster;
              isOnRoster
                ? attendeesOnRoster.push(currAttendee)
                : attendeesNotOnRoster.push(currAttendee);
            });
          
            setSortedAttendees({
                onTeam: attendeesOnRoster,
                notOnTeam: attendeesNotOnRoster,
            });
        };
        
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
                sortedAttendees.notOnTeam.map((attendee, index) => {
                    return (
                        <AttendeeTableRow
                            key={Math.random()}
                            name={
                                attendee.userId.name.firstName +
                                " " +
                                attendee.userId.name.lastName
                            }
                            role={attendee.userId.currentRole}
                            postUser={() => addToRoster(attendee.userId._id, index)}
                        ></AttendeeTableRow>
                    );
                })
            )}

            {sortedAttendees && (
                sortedAttendees.onTeam.map((attendee) => {
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
