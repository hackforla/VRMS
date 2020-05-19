module.exports = (cron, fetch) => {

    // Check to see if any recurring events are happening today, 
    // and if so, check to see if an event has already been created
    // for it. If not, create one.

    let EVENTS;
    let RECURRING_EVENTS;
    let TODAY_DATE;
    let TODAY;
    const URL = process.env.NODE_ENV === 'prod' ? 'https://www.vrms.io' : 'http://localhost:4000';

    const fetchEvents = async () => {
        try {
            const res = await fetch(`${URL}/api/events/`);
            EVENTS = await res.json();

            // return EVENTS;
        } catch(error) {
            console.log(error);
        };
    };

    const fetchRecurringEvents = async () => {
        try {
            const res = await fetch(`${URL}/api/recurringevents/`);
            RECURRING_EVENTS = await res.json();

            // return resJson;
        } catch(error) {
            console.log(error);
        };
    };

    async function filterAndCreateEvents() {
        TODAY_DATE = new Date();
        TODAY = TODAY_DATE.getDay();
        console.log("Date: ", TODAY_DATE, "Day: ", TODAY);
        const recurringEvents = RECURRING_EVENTS;
        // console.log("Today Day: ", TODAY);
        // Filter recurring events where the event date is today
        if (recurringEvents && recurringEvents.length > 0) {
            const filteredEvents = recurringEvents.filter(event => {
                const eventDay = new Date(event.date).getDay();
                // console.log("Event Day: ", eventDay);
                return (eventDay === TODAY);
            });
            // console.log("Today's events: ", filteredEvents);

            // console.log('TODAY_DATE for filter: ', TODAY_DATE)

            // For each recurring event, check to see if an event already
            // exists for it and do something if true/false. Can't use
            // forEach function with async/await.
            for (let i = 0; i < filteredEvents.length; i++) {
                const eventExists = await checkIfEventExists(filteredEvents[i].name);
                // console.log('Event exists? ', eventExists);
                const eventDate = new Date(filteredEvents[i].date);

                if (eventExists) {
                    console.log("Not going to run ceateEvent");
                } else {
                    // Create new event
                    const hours = eventDate.getHours();
                    const minutes = eventDate.getMinutes();
                    const seconds = eventDate.getSeconds();
                    const milliseconds = eventDate.getMilliseconds();

                    const yearToday = TODAY_DATE.getFullYear();
                    const monthToday = TODAY_DATE.getMonth();
                    const dateToday = TODAY_DATE.getDate();

                    const newEventDate = new Date(yearToday, monthToday, dateToday, hours, minutes, seconds, milliseconds);
                    // console.log('Today Date: ', newEventDate, '\n');

                    const newEndTime = new Date(yearToday, monthToday, dateToday, hours + filteredEvents[i].hours, minutes, seconds, milliseconds)

                    const eventToCreate = {
                        name: filteredEvents[i].name && filteredEvents[i].name,
                        location: {
                            city: filteredEvents[i].location.city && filteredEvents[i].location.city,
                            state: filteredEvents[i].location.state && filteredEvents[i].location.state,
                            country: filteredEvents[i].location.country && filteredEvents[i].location.country
                        },
                        hacknight: filteredEvents[i].hacknight && filteredEvents[i].hacknight,
                        eventType: filteredEvents[i].eventType && filteredEvents[i].eventType,
                        description: filteredEvents[i].eventDescription && filteredEvents[i].eventDescription,
                        project: filteredEvents[i].project && {                                          
                            projectId: filteredEvents[i].project.projectId ? filteredEvents[i].project.projectId : '12345',
                            name: filteredEvents[i].project.name && filteredEvents[i].project.name,
                            videoConferenceLink: filteredEvents[i].project.videoConferenceLink && filteredEvents[i].project.videoConferenceLink,
                            githubIdentifier: filteredEvents[i].project.githubIdentifier && filteredEvents[i].project.githubIdentifier,
                            hflaWebsiURL: filteredEvents[i].project.hflaWebsiteUrl && filteredEvents[i].project.hflaWebsiteUrl,
                            githubUrl: filteredEvents[i].project.githubUrl && filteredEvents[i].project.githubUrl
                        },
                        date: filteredEvents[i].date && newEventDate,
                        startTime: filteredEvents[i].startTime && newEventDate,
                        endTime: filteredEvents[i].endTime && newEndTime,
                        hours: filteredEvents[i].hours && filteredEvents[i].hours
                    }
                    // console.log(eventToCreate);
                    const created = await createEvent(eventToCreate);
                    console.log(created);
                };
            };
        };
    };

    async function checkIfEventExists(eventName) {
        const events = EVENTS;
        // const today = new Date();

        if (events && events.length > 0) {
            const filteredEvents = events.filter(event => {
                const eventDate = new Date(event.date);
                // console.log("Event Date: ", eventDate);
                const year = eventDate.getFullYear();
                const month = eventDate.getMonth();
                const date = eventDate.getDate();

                const yearToday = TODAY_DATE.getFullYear();
                const monthToday = TODAY_DATE.getMonth();
                const dateToday = TODAY_DATE.getDate();
                // console.log("Event: ", year, month, date);
                // console.log("Today: ", yearToday, monthToday, dateToday);
                // console.log((year === yearToday && month === monthToday && date === dateToday && eventName === event.name));
                return (year === yearToday && month === monthToday && date === dateToday && eventName === event.name);
            });
            console.log("Events already created: ", filteredEvents);
            return filteredEvents.length > 0 ? true : false;
        };
    };
    
    const createEvent = async (event) => {
        if(event) {
            // console.log('Creating event: ', event);
            const jsonEvent = JSON.stringify(event);
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: jsonEvent
            }
            console.log('Running createEvent: ', jsonEvent);

            try {
                const response = await fetch(`${URL}/api/events/`, options); 
                const resJson = await response.json();
                return resJson;
                // console.log(resJson);
            } catch (error) {
                console.log(error);
            };
        };
    };
    
    async function runTask() {
        console.log("Creating today's events");

        // console.log('Fetching events...');
        await fetchEvents();
        // console.log('Fetching recurring events...');
        await fetchRecurringEvents();
        // console.log('Filtering and creating...');
        await filterAndCreateEvents();

        console.log("Today's events are created");
    
    };

    // setTimeout(() => {
    //     runTask();
    // }, 5000);

    const scheduledTask = cron.schedule('*/10 7-18 * * *', () => {
        runTask();
    });

    return scheduledTask;
};