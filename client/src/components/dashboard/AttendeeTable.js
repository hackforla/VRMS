import React from "react";
import styles from "../../sass/ProjectLeaderDashboard.module.scss";
import AttendeeTableRow from "./AttendeeTableRow";
const AttendeeTable = ({ attendees, activeMeeting, onboarded }) => {
    return (
        <div className={styles.attendeeTable}>
            <div className={styles.attendeeTableBoxLeft}>
                <span className={styles.attendeeTableTitle}>name</span>
            </div>
            <div className={styles.attendeeTableBoxCenter}>
                <span className={styles.attendeeTableTitle}>role</span>
            </div>
            <div className={styles.attendeeTableBoxCenter}>
                <span className={styles.attendeeTableTitle}>
                    {onboarded ? "here?" : "check-in"}
                </span>
            </div>
            {/* {activeMeeting &&
                attendees
                    .filter((attendee) => {
                        return attendee.userId.newMember;
                    })
                    .map((attendee) => {
                        console.log(attendee.userId.newMember);
                        return (
                            <AttendeeTableRow
                                key={Math.random()}
                                name={
                                    attendee.userId.name.firstName +
                                    " " +
                                    attendee.userId.name.lastName
                                }
                                role={attendee.userId.currentRole}
                                isNewMember={true}
                            ></AttendeeTableRow>
                        );
                    })}
            {activeMeeting &&
                attendees
                    .filter((attendee) => {
                        return (
                            !attendee.userId.newMember &&
                            attendee.userId.name.firstName !== "test"
                        );
                    })
                    .map((attendee) => {
                        console.log(attendee.userId.newMember);
                        return (
                            <AttendeeTableRow
                                key={Math.random()}
                                name={
                                    attendee.userId.name.firstName +
                                    " " +
                                    attendee.userId.name.lastName
                                }
                                role={attendee.userId.currentRole}
                                present={true}
                            ></AttendeeTableRow>
                        );
                    })}
            {activeMeeting &&
                attendees
                    .filter((attendee) => {
                        return (
                            !attendee.userId.newMember &&
                            attendee.userId.name.firstName === "test"
                        );
                    })
                    .map((attendee) => {
                        console.log(attendee.userId.newMember);
                        return (
                            <AttendeeTableRow
                                key={Math.random()}
                                name={
                                    attendee.userId.name.firstName +
                                    " " +
                                    attendee.userId.name.lastName
                                }
                                role={attendee.userId.currentRole}
                                present={false}
                            ></AttendeeTableRow>
                        );
                    })} */}
            {activeMeeting &&
                attendees.map((attendee) => {
                    console.log(attendee.userId.newMember);
                    return (
                        <AttendeeTableRow
                            key={Math.random()}
                            name={
                                attendee.userId.name.firstName +
                                " " +
                                attendee.userId.name.lastName
                            }
                            role={attendee.userId.currentRole}
                            isNewMember={!onboarded}
                            present={attendee.userId.name.firstName !== "test"}
                        ></AttendeeTableRow>
                    );
                })}
            {/* {activeMeeting &&
                attendees
                    .filter((attendee) => {
                        return (
                            !attendee.userId.newMember &&
                            attendee.userId.name.firstName !== "test"
                        );
                    })
                    .map((attendee) => {
                        console.log(attendee.userId.newMember);
                        return (
                            <AttendeeTableRow
                                key={Math.random()}
                                name={
                                    attendee.userId.name.firstName +
                                    " " +
                                    attendee.userId.name.lastName
                                }
                                role={attendee.userId.currentRole}
                                present={true}
                            ></AttendeeTableRow>
                        );
                    })} */}
        </div>
    );
};

export default AttendeeTable;
