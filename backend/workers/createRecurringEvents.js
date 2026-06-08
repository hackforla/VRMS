module.exports = (cron, fetch) => {

    // Check to see if any recurring events are happening today,
    // and if so, check to see if an event has already been created
    // for it. If not, create one.

    let EVENTS;
    let RECURRING_EVENTS;
    let TODAY_DATE;
    let TODAY;
    const URL = process.env.NODE_ENV === 'prod' ? 'https://www.vrms.io' : 'http://localhost:4000';

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
        const { getTodayDayLA } = await import('./lib/eventTime.js');
        const { filterTodaysRecurringEvents, buildNewEvent, isEventDuplicate } = await import('./lib/recurringEventOps.js');

        TODAY_DATE = new Date();
        TODAY = getTodayDayLA();
        console.log("Date: ", TODAY_DATE, "Day: ", TODAY);
        const recurringEvents = RECURRING_EVENTS;

        if (recurringEvents && recurringEvents.length > 0) {
            const filteredEvents = await filterTodaysRecurringEvents(recurringEvents, TODAY_DATE);

            // For each recurring event, check to see if an event already
            // exists for it and do something if true/false. Can't use
            // forEach function with async/await.
            for (const filteredEvent of filteredEvents) {
                const eventExists = isEventDuplicate(filteredEvent.name, EVENTS || [], TODAY_DATE);

                if (eventExists) {
                    console.log("Not going to run createEvent");
                } else {
                    const eventToCreate = await buildNewEvent(filteredEvent, TODAY_DATE);
                    const created = await createEvent(eventToCreate);
                    console.log(created);
                }
            }
        }
    }

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