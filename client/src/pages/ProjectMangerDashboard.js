import React, { useEffect, useState } from "react";
import "../sass/Dashboard.scss";
import styles from "../sass/ProjectManagerDashboard.module.scss";
import UpcomingEvent from "../components/presentational/upcomingEvent";
import AttendeesCheckList from "../components/dashboard/AttendeesCheckList";
import AttendeesCheckListForm from "../components/dashboard/AttendeeCheckListForm";

const ProjectManagerDashboard = () => {
    const [isCheckInReady, setIsCheckInReady] = useState();
    const [nextEvent, setNextEvent] = useState([]);
    const [attendees, setAttendees] = useState([]);

    async function getNextEvent() {
        // event id temporarily hard coded so actual check in data would be listed
        const events = await fetch("/api/events/5e8a51892a285b791c2cc2b7");
        const eventsJson = await events.json();
        console.log(eventsJson);
        setIsCheckInReady(eventsJson.checkInReady);

        setNextEvent([eventsJson]);
    }

    async function getAttendees() {
        // event id that attendees are gotten from is temporarily hard coded
        try {
            const event = await fetch(
                "/api/checkins/findEvent/5e8a51892a285b791c2cc2b7"
            );
            const attendesJson = await event.json();

            setAttendees(attendesJson);
            // const dates = eventsJson.map((event) => {
            //     return Date.parse(event.date);
            // });

            // const nextDate = new Date(Math.max.apply(null, dates));
            // // console.log(nextDate);
            // const nextDateUtc = new Date(nextDate).toISOString();

            // const nextEvent = eventsJson.filter((event) => {
            //     const eventDate = new Date(event.date).toISOString();
            //     return eventDate === nextDateUtc;
            // });

            // setIsCheckInReady(nextEvent[0].checkInReady);
            // setNextEvent(nextEvent);
        } catch (error) {
            console.log(error);
        }
    }

    async function setCheckInReady(e, nextEventId) {
        e.preventDefault();
        try {
            await fetch(`/api/events/${nextEventId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                if (response.ok) {
                    setIsCheckInReady((prevCheckIn) => !prevCheckIn);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getNextEvent();
        getAttendees();
    }, []);

    let attendeesList = attendees.map((attendee) => (
        <li>
            {attendee.userId.name.firstName +
                " " +
                attendee.userId.name.lastName}
        </li>
    ));

    return (
        <div className="flex-container">
            <div className="dashboard">
                <div className="dashboard-header">
                    <p className="dashboard-header-text-small">
                        You have an event going on!
                    </p>
                </div>
                <UpcomingEvent
                    isCheckInReady={isCheckInReady}
                    nextEvent={nextEvent}
                    setCheckInReady={setCheckInReady}
                ></UpcomingEvent>
                {isCheckInReady ? (
                    <React.Fragment>
                        <div
                            className="dashboard-header"
                            style={{ marginBottom: ".5rem" }}
                        >
                            <p
                                className={[
                                    "dashboard-header-text-small",
                                    styles.onRoster,
                                ].join(" ")}
                            >
                                On Roster
                            </p>
                        </div>
                        <AttendeesCheckList
                            attendees={attendees.filter((attendee) => {
                                return attendee.userId.newMember;
                            })}
                        ></AttendeesCheckList>
                        <div
                            className="dashboard-header"
                            style={{ marginBottom: ".5rem" }}
                        >
                            <p
                                className={[
                                    "dashboard-header-text-small",
                                    styles.notOnRoster,
                                ].join(" ")}
                            >
                                Not on Roster
                            </p>
                        </div>
                        <AttendeesCheckListForm
                            attendees={attendees.filter((attendee) => {
                                return !attendee.userId.newMember;
                            })}
                        ></AttendeesCheckListForm>
                        <div className={styles.center}>
                            <button>SUBMIT ONBOARDING</button>
                        </div>
                    </React.Fragment>
                ) : null}
            </div>
        </div>
    );
};

export default ProjectManagerDashboard;
