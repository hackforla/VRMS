module.exports = (cron, fetch) => {

    // Check to see if any recurring events are happening today, 
    // and if so, check to see if an event has already been created
    // for it. If not, create one.

    const TODAY = new Date().getDay();
    let EVENTS;
    let RECURRING_EVENTS;

    const fetchEvents = async () => {
        try {
            const res = await fetch("https://vrms.io/api/events");
            EVENTS = await res.json();

            // return EVENTS;
        } catch(error) {
            console.log(error);
        };
    };

    const fetchRecurringEvents = async () => {
        try {
            const res = await fetch("https://vrms.io/api/recurringevents");
            RECURRING_EVENTS = await res.json();

            // return resJson;
        } catch(error) {
            console.log(error);
        };
    };

    async function getAndFilterEvents(today) {
        const recurringEvents = RECURRING_EVENTS;

        // Filter recurring events where the event date is today
        if (recurringEvents && recurringEvents.length > 0) {
            const filteredEvents = recurringEvents.filter(event => {
                const eventDay = new Date(event.date).getDay();

                return (eventDay === today);
            });

            // For each recurring event, check to see if an event already exists for it
            // and do something if true/false 
            filteredEvents.forEach(async (event, index) => {
                const eventExists = await checkIfEventExists(event.name);
                // console.log(eventExists);
                if (eventExists) {
                    return false;// console.log("I'm not going to run ceateEvent")
                } else {
                    const eventToCreate = {
                        name: event.name,
                        location: {
                            city: event.location.city,
                            state: event.location.state,
                            country: event.location.country
                        },
                        hacknight: event.hacknight,
                        eventType: event.eventType,
                        description: event.eventDescription,
                        project: {                                          
                            projectId: event.project.projectId,
                            name: event.project.name,
                            videoConferenceLink: event.project.videoConferenceLink,
                            githubIdentifier: event.project.githubIdentifier,
                            hflaWebsiteUrl: event.project.hflaWebsiteUrl,
                            githubUrl: event.project.githubUrl
                        },
                        date: event.date,
                        startTime: event.startTime,
                        endTime: event.endTime,
                        hours: event.hours,
                        owner: {
                            ownerId: event.owner.ownerId
                        }
                    }
                    // console.log(eventToCreate);
                    createEvent(eventToCreate);
                }
            });
        };
    };

    async function checkIfEventExists(eventName) {
        const events = EVENTS;

        if (events && events.length > 0) {
            const filteredEvents = events.filter(event => {
                const eventDate = new Date(event.date).toISOString();
                const eventDateSliced = eventDate.slice(0, 10);
                // console.log(eventDateSliced);
                const today = new Date().toISOString();
                const todayDateSliced = today.slice(0, 10);
                // console.log(todayDate);
                // console.log('TRUE OR FALSE', eventDateSliced === todayDateSliced);
                return (eventDateSliced === todayDateSliced && eventName === event.name);
            });
            // console.log('FILTERED: ', filteredEvents);
            return filteredEvents.length > 0 ? true : false;
        };
    };
    
    async function createEvent(event) {
        if(event) {
            // console.log('Opening event: ', event);
            const jsonEvent = JSON.stringify(event);
            console.log('Running createEvent :', jsonEvent);

            await fetch(`https://vrms.io/api/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: jsonEvent
            })
                .catch(err => {
                    console.log(err);
                });
        };
    };
    
    async function runTask() {
        console.log("Creating today's events");

        await fetchEvents();
        await fetchRecurringEvents();
        await getAndFilterEvents(TODAY);

        console.log("Today's events are created");
    
    };

    const scheduledTask = cron.schedule('0 1-16 * * *', () => {
        runTask();
    });

    return scheduledTask;
};