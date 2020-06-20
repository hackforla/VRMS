import React, { useEffect, useState } from "react";
import "../sass/Dashboard.scss";
import styles from "../sass/ProjectLeaderDashboard.module.scss";
import UpcomingEvent from "../components/presentational/upcomingEvent";
import AttendeeTable from "../components/dashboard/AttendeeTable";
import RosterTable from "../components/dashboard/RosterTable";
import ProjectDashboardContainer from "../components/presentational/projectDashboardContainer";

import DashboardButton from "../components/dashboard/DashboardButton";
import { Link } from "react-router-dom";
// import fetch from "node-fetch";

const ProjectLeaderDashboard = () => {
  const [isCheckInReady, setIsCheckInReady] = useState();
  const [nextEvent, setNextEvent] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [project, setProject] = useState([]);
  const [roster, setRoster] = useState([]);
    
  const [attendeeOrRoster, setAttendeeOrRoster] = useState("attendee");
  const dummyDataRoster = [
    {
        userId: {
          currentRole: "Front End Developer", 
          email: "carlos@test.com", 
          name: {firstName: "Carlos", lastName: "F"},
          newMember: true, 
          _id: "5e8bac41bf40080392329cfc"
        }, 
        projectId:"5e8bfbcf791f537f7e86daeb",
        teamMemberStatus: true,
        vrmsProjectAdmin: false,
        roleOnProject: "Front End Developer",
        joinedDate: "2020-04-06T22:59:06.095Z",
        onProjectGithub: false, 
        onProjectGoogleDrive: false,
      }, 
      {
        userId: {
          currentRole: "Tester", 
          email: "matt@test.com", 
          name: {firstName: "Matt", lastName: "Test"},
          newMember: true, 
          _id: "5e8bac41bf40080392329cfc"
        }, 
        projectId: "5e8bfbcf791f537f7e86daeb",
        teamMemberStatus: true,
        vrmsProjectAdmin: false,
        roleOnProject: "Tester",
        joinedDate: new Date(),
        onProjectGithub: true, 
        onProjectGoogleDrive: false,
      },
      {
        userId: {
          currentRole: "Tester", 
          email: "testmatt@test.com", 
          name: {firstName: "Matt", lastName: "Test"},
          newMember: false, 
          _id: "5e8bb4e2d1620d050cceeb42"
        }, 
        projectId: "5e8bfbcf791f537f7e86daeb",
        teamMemberStatus: true,
        vrmsProjectAdmin: false,
        roleOnProject: "Tester",
        joinedDate: new Date(),
        onProjectGithub: true, 
        onProjectGoogleDrive: true,
      }, 
      {
        userId: {
          currentRole: "Tester", 
          email: "testingmatt@test.com", 
          name: {firstName: "Matt", lastName: "Testing"},
          newMember: false, 
          _id: "5e8bb4e2d1620d050cceeb42"
        }, 
        projectId: "5e8bfbcf791f537f7e86daeb",
        teamMemberStatus: true,
        vrmsProjectAdmin: false,
        roleOnProject: "Tester",
        joinedDate: new Date(),
        onProjectGithub: true, 
        onProjectGoogleDrive: true,
      }
  ]
  // const [roster, setRoster] = useState(dummyDataRoster);

  async function getNextEvent() {
    // event id temporarily hard coded so actual check in data would be listed
    try {
      const events = await fetch("/api/events/nexteventbyproject/5eed1f6efbb88f85ef72f160");
      const eventsJson = await events.json();
      setIsCheckInReady(eventsJson.checkInReady);
      setNextEvent([eventsJson]);
      console.log('NEXT EVENT', eventsJson);
    } catch (err) {
      console.log(err);
    }
  }

  async function getProjectFromUserId() {
    try {
      const project = await fetch("/api/projectteammembers/projectowner/5e2790b06dc5b4ed0bc1df56");
      const projectJson = await project.json();
      console.log('PROJECT', projectJson);
      setProject(projectJson);
      // console.log('PROJECT', projectJson);
    } catch (error) {
      console.log(error);
    }
  }

  async function getRoster() {
    try {
      if (project && project.projectId) {
        const roster = await fetch(`/api/projectteammembers/${project.projectId}`);
        const rosterJson = await roster.json();
        console.log('ROSTER', rosterJson);
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
        const attendees = await fetch(
          `/api/checkins/findEvent/${id}`
        );
  
        const attendeesJson = await attendees.json();
        console.log('GETATTENDEES', attendeesJson)
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
      }).then((response) => {
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
    await getNextEvent();
  }

  useEffect(() => {
    getDashboardInfo();
  }, []);

  useEffect(() => {
    getAttendees();
  }, [nextEvent]);

  useEffect(() => {
    getRoster();
  }, [project]);

  return (
    <div className="flex-container">
      {project && (
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
          />
          
          <Link
            className="checkin-toggle fill-green"
            onClick={() => {
              changeTable(false);
            }}
          >
            Roster
          </Link>

          {isCheckInReady ? (
            <Link
              className="checkin-toggle fill-green"
              onClick={() => {
                changeTable(true);
              }}
              // onClick={(e) => props.setCheckInReady(e, props.nextEvent[0]._id)}
            >
              Attendees
            </Link>
          ) : null}

          {isCheckInReady ? (
            <>
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

              {(attendees.length > 0) && (roster.length > 0) && (
                <ProjectDashboardContainer
                  changeTable={changeTable}
                  attendees={attendees}
                  roster={roster}
                  attendeeOrRoster={attendeeOrRoster}
                />
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ProjectLeaderDashboard;
