import React, { useState, useEffect } from "react";
import CheckInButtons from "../components/presentational/CheckInButtons";
import ls from "local-storage";

import "../sass/Home.scss";

const Home = (props) => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [event, setEvent] = useState("--SELECT ONE--");

    async function fetchEvents() {
        try {
            setIsLoading(true);
            const res = await fetch("/api/events?checkInReady=true");
            const resJson = await res.json();
            await resJson.unshift("--SELECT ONE--");

            setEvents(resJson);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            // setIsError(error);
            // alert(error);
        }
    }

    const handleEventChange = (e) => {
        setEvent(e.currentTarget.value);
        // setIsQuestionAnswered(true);
    };

    useEffect(() => {
        fetchEvents();

        // console.log(event);
    }, [event]);

    return (
        <div className="flexcenter-container">
            <div className="home">
                <div className="home-headers">
                    <h1>VRMS</h1>
                    <h2>Volunteer Relationship Management System</h2>
                </div>

                {events && events.length > 1 && (
                    <div className="meeting-select-container">
                        <form
                            className="form-select-meeting"
                            autoComplete="off"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <div className="form-row">
                                <div className="form-input-select">
                                    <label htmlFor={"meeting-checkin"}>
                                        Select a meeting to check-in:
                                    </label>
                                    <div className="radio-buttons">
                                        <select
                                            name={"meeting-checkin"}
                                            className="select-meeting-dropdown"
                                            // aria-label="topic"
                                            onChange={handleEventChange}
                                            required
                                        >
                                            {events.map((event) => {
                                                return (
                                                    <option key={event._id || 0} value={event._id}>
                                                        {event.name || "--SELECT ONE--"}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                <div className="home-buttons">
                    {event !== "--SELECT ONE--" && <CheckInButtons event={event} />}
                    {event === "--SELECT ONE--" && <CheckInButtons disabled={true} event={event} />}
                </div>
            </div>
        </div>
    );
};

export default Home;
