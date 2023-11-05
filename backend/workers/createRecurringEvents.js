module.exports = (cron, fetch) => {

    // Check to see if any recurring events are happening today,
    // and if so, check to see if an event has already been created
    // for it. If not, create one.

    let EVENTS;
    let RECURRING_EVENTS;
    let TODAY_DATE;
    let TODAY;
    const URL = process.env.NODE_ENV === 'prod' ? 'https://www.vrms.io' : `http://localhost:${process.env.BACKEND_PORT}`;

    const headerToSend = process.env.CUSTOM_REQUEST_HEADER;
    const fetchEvents = async () => {
        try {
            const res = await fetch(`${URL}/api/events/`, {
                headers: {
                  "x-customrequired-header": headerToSend
                }
            });

            EVENTS = await res.json();

            // return EVENTS;
        } catch(error) {
            console.log(error);
        };
    };

    const fetchRecurringEvents = async () => {
        try {
            const res = await fetch(`${URL}/api/recurringevents/`, {
                headers: {
                  "x-customrequired-header": headerToSend
                }
            });
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
            // For each recurring event, check to see if an event already
            // exists for it and do something if true/false. Can't use
            // forEach function with async/await.
            for (filteredEvent of filteredEvents) {
                const eventExists = await checkIfEventExists(filteredEvent.name);

                if (eventExists) {
                    //Do nothing
                    console.log("➖ Not going to run ceateEvent");
                } else {
                    // Create new event
                    const eventToCreate = generateEventData(filteredEvent);
                    
                    const created = await createEvent(eventToCreate);
                    console.log("➕", created);
                };
            };
        };
    };

    function generateEventData(eventData, TODAY_DATE = new Date()) {
        const eventDate = new Date(eventData.startTime);
        // Create new event
        const hours = eventDate.getHours();
        const minutes = eventDate.getMinutes();
        const seconds = eventDate.getSeconds();
        const milliseconds = eventDate.getMilliseconds();

        const yearToday = TODAY_DATE.getFullYear();
        const monthToday = TODAY_DATE.getMonth();
        const dateToday = TODAY_DATE.getDate();

        const newEventDate = new Date(yearToday, monthToday, dateToday, hours, minutes, seconds, milliseconds);

        const newEndTime = new Date(yearToday, monthToday, dateToday, hours + filteredEvent.hours, minutes, seconds, milliseconds)

        const eventToCreate = {
            name: eventData.name && eventData.name,
            hacknight: eventData.hacknight && eventData.hacknight,
            eventType: eventData.eventType && eventData.eventType,
            description: eventData.eventDescription && eventData.eventDescription,
            project: eventData.project && eventData.project,
            date: eventData.date && newEventDate,
            startTime: eventData.startTime && newEventDate,
            endTime: eventData.endTime && newEndTime,
            hours: eventData.hours && eventData.hours
        }
        if (eventData.hasOwnProperty("location")) {
            eventToCreate.location = {
                city: eventData.location.city ? eventData.location.city : 'REMOTE',
                state: eventData.location.state ? eventData.location.state : 'REMOTE',
                country: eventData.location.country ? eventData.location.country : 'REMOTE'
            };
        }
        return eventToCreate
    };

    async function checkIfEventExists(eventName) {
        const events = EVENTS;
        // const today = new Date();

        if (events && events.length > 0) {
            const filteredEvents = events.filter(event => {
                const eventDate = new Date(event.date);
                const year = eventDate.getFullYear();
                const month = eventDate.getMonth();
                const date = eventDate.getDate();

                const yearToday = TODAY_DATE.getFullYear();
                const monthToday = TODAY_DATE.getMonth();
                const dateToday = TODAY_DATE.getDate();

                return (year === yearToday && month === monthToday && date === dateToday && eventName === event.name);
            });
            console.log("Events already created: ", filteredEvents);
            return filteredEvents.length > 0 ? true : false;
        };
    };

    const createEvent = async (event) => {
        if(event) {
            const jsonEvent = JSON.stringify(event);
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-customrequired-header": headerToSend
                },
                body: jsonEvent
            }

            console.log('Running createEvent: ', jsonEvent);

            try {
                const response = await fetch(`${URL}/api/events/`, options);
                const resJson = await response.json();
                return resJson;
            } catch (error) {
                console.log(error);
            };
        };
    };

    async function runTask() {
        console.log("Creating today's events");

        await fetchEvents();
        await fetchRecurringEvents();
        await filterAndCreateEvents();

        console.log("Today's events are created");

    };

    const scheduledTask = cron.schedule('*/30 * * * *', () => {
        runTask();
    });
    return scheduledTask;
};