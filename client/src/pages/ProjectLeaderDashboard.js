import React, { useEffect, useState } from "react";
import styles from "../sass/ProjectLeaderDashboard.module.scss";
import UpcomingEvent from "../components/presentational/upcomingEvent";
import ProjectDashboardContainer from "../components/presentational/projectDashboardContainer";
import DashboardButton from "../components/dashboard/DashboardButton";
import ProjectInfo from "../components/dashboard/ProjectInfo";
import { Link } from "react-router-dom";

import "../sass/Dashboard.scss";

import AddTeamMember from "../components/dashboard/AddTeamMember";
const ProjectLeaderDashboard = () => {
  const [isCheckInReady, setIsCheckInReady] = useState();
  const [nextEvent, setNextEvent] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [project, setProject] = useState([]);
  const [roster, setRoster] = useState([]);
	const [attendeeOrRoster, setAttendeeOrRoster] = useState(true);
	const [forceRerender, setForceRerender] = useState(true);
	const [isError, setIsError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  let attendeesAreFormatted = false;
  // const [attendeesAreFormatted, setAttendeesAreFormatted] = useState(false);

  async function getProjectFromUserId() {
    try {
      const project = await fetch("/api/projectteammembers/projectowner/5e2790b06dc5b4ed0bc1df56");
      const projectJson = await project.json();
      console.log('PROJECT', projectJson);
      setProject(projectJson);

    } catch (error) {
      console.log(error);
    };
  };

  async function getNextEvent() {
    // event id temporarily hard coded so actual check in data would be listed
    try {
      if (project && project.projectId) {
        const events = await fetch(`/api/events/nexteventbyproject/${project.projectId._id}`);
        const eventsJson = await events.json();
        setIsCheckInReady(eventsJson.checkInReady);
        setNextEvent([eventsJson]);
        // console.log('NEXT EVENT', eventsJson);
      }
    } catch (err) {
      console.log(err);
    };
  };

  async function getRoster() {
    try {
      if (project && project.projectId) {
        const roster = await fetch(`/api/projectteammembers/${project.projectId._id}`);
        const rosterJson = await roster.json();
        // console.log('ROSTER', rosterJson);
        setRoster(rosterJson);
      }
    } catch (error) {
      console.log(error);
    };
  };

  async function getAttendees() {
    try {
      if (nextEvent && nextEvent[0]._id) {
        const id = nextEvent[0]._id;
        const attendees = await fetch(`/api/checkins/findEvent/${id}`);
        const attendeesJson = await attendees.json();
        // console.log('GETATTENDEES', attendeesJson);
        setAttendees(attendeesJson);

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
      } 
    } catch (error) {
      console.log(error);
    };
  };

  async function setCheckInReady(e, nextEventId) {
    e.preventDefault();
    try {
      await fetch(`/api/events/${nextEventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            setIsCheckInReady((prevCheckIn) => !prevCheckIn);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  async function changeTable(e) {
    setAttendeeOrRoster(e);
  }

  async function getDashboardInfo() {
    await getProjectFromUserId();
	}
	
	const handleSubmit = async (e, email) => {
		e.preventDefault();
		setIsError(false);
		setIsSuccess(false);

		if (email === "") {
				setIsError(true);
				setErrorMessage("Please don't leave the field blank.");
		} else if (!email.includes("@") || !email.includes(".")) {
				setIsError(true);
				setErrorMessage("Please format the email address correctly.");
		} else {
				await addToRoster(email);
				await setForceRerender(!forceRerender);
		}
};

async function addToRoster(email) {
		try {
				return await fetch("/api/checkuser", {
						method: "POST",
						headers: {
						"Content-Type": "application/json",
						},
						body: JSON.stringify({ email }),
				})
				.then((res) => {
						if (res.ok) {
								return res.json();
						}

						throw new Error(res.statusText);
				})
				.then(response => {
						if (response === false) {
								setIsError(true);
								setErrorMessage("Email not found.");

								return response;
						} else {
								return response;
						}
				})
				.then(user => {
					if (user === false) {
						return false
					} else{
						addMember(user);
					}
				})
				.catch((err) => {
						console.log(err);
				});
		} catch (error) {
				console.log(error);
		}
}

async function addMember(user) {
		const parameters = {
				userId: user._id,
				projectId: project.projectId,
				roleOnProject: user.currentRole
		};

		try {
				return await fetch("/api/projectteammembers", {
						method: "POST",
						headers: {
						"Content-Type": "application/json",
						},
						body: JSON.stringify(parameters),
				})
				.then((res) => {
						if (res !== false) {
								setIsSuccess(true);
						}
				})
				.catch((err) => {
						console.log(err);
				});
		} catch (error) {
				console.log(error);
		}
}

function formatAttendees () {
  attendees.map(attendee => {
      const isOnRoster = Boolean(roster.find(teamMember => 
        teamMember.userId._id === attendee.userId._id));
      
      attendee.isOnRoster = isOnRoster ? true : false ;
  })

  setAttendees(attendees);
  attendeesAreFormatted = true;
}

  useEffect(() => {
    getDashboardInfo();
  }, []);

  useEffect(() => {
    console.log('getAttendees() called');
    getAttendees();
  }, [nextEvent]);

  useEffect(() => {
    getRoster();
  }, [project, forceRerender]);

  useEffect(() => {
    getNextEvent();
  }, [project]);

  useEffect(() => {
    console.log('formatAttendees() called');
    formatAttendees();
  }, [attendees, roster])

  return (
    <div className="flex-container">
      {project && project.projectId && (
        <div className="dashboard">

          <ProjectInfo project={project} />

          <div className="dashboard-header flex">
            <div className="active-event-dot"></div>
            <p className="dashboard-header-text-small">
              You have an event going on!
            </p>
          </div>

          <UpcomingEvent
            isCheckInReady={isCheckInReady}
            nextEvent={nextEvent}
            setCheckInReady={setCheckInReady}
          />
          
          <AddTeamMember isError={isError} errorMessage={errorMessage} isSuccess={isSuccess} addToTeamHandler={handleSubmit}/>

          <div className="dashboard-chart-container">
            {/* {isCheckInReady ? ( */}
              <button
                className={`tab-selector ${attendeeOrRoster ? 'tab-selected' : null}`}
                onClick={() => {
                  changeTable(true);
                }}
                // onClick={(e) => props.setCheckInReady(e, props.nextEvent[0]._id)}
              >
                ATTENDEES
              </button>
            {/* ) : null} */}
            <button
              className={`tab-selector ${!attendeeOrRoster ? 'tab-selected' : null}`}
              onClick={() => {
                changeTable(false);
              }}
            >
              ROSTER
            </button>
          </div>

          {isCheckInReady ? (
            <>
              {(attendees.length > 0) && (roster.length > 0) && (
                <ProjectDashboardContainer
                  attendeesAreFormatted={attendeesAreFormatted}
                  changeTable={changeTable}
                  attendees={attendees}
                  roster={roster}
                  setRoster={setRoster}
                  attendeeOrRoster={attendeeOrRoster}
                  projectId={project._id}
                />
              )}

              <div
                className={["dashboard-header", styles.dashboardHeaderFlex].join(
                  " "
                )}
                style={{ marginBottom: ".5rem" }}
              >
                <p className={styles.dashboardHeadingProjectLeader}>
                  {attendeeOrRoster ? 'Meeting Participants' : 'Team Roster'}
                </p>
                <DashboardButton>Download .csv</DashboardButton>
              </div>

            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ProjectLeaderDashboard;
