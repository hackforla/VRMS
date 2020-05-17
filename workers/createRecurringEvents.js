module.exports = (cron, fetch) => {

    // Check to see if any recurring events are happening today, 
    // and if so, check to see if an event has already been created
    // for it. If not, create one.

    const TODAY = new Date().getDay();
    let EVENTS;
    let RECURRING_EVENTS;
    const url = process.env.NODE_ENV === 'prod' ? 'https://www.vrms.io' : 'http://localhost:4000';

    const fetchEvents = async () => {
        try {
            const res = await fetch(`${url}/api/events/`);
            // const res = await fetch("http://localhost:4000/api/events");
            EVENTS = await res.json();

            // return EVENTS;
        } catch(error) {
            console.log(error);
        };
    };

    const fetchRecurringEvents = async () => {
        try {
            const res = await fetch(`${url}/api/recurringevents/`);
            // const res = await fetch("http://localhost:4000/api/recurringevents");
            RECURRING_EVENTS = await res.json();

            // return resJson;
        } catch(error) {
            console.log(error);
        };
    };

    async function filterAndCreateEvents(today) {
        const recurringEvents = RECURRING_EVENTS;
        const todayDay = today;

        // Filter recurring events where the event date is today
        if (recurringEvents && recurringEvents.length > 0) {
            const filteredEvents = recurringEvents.filter(event => {
                const eventDay = new Date(event.date).getDay();

                return (eventDay === todayDay);
            });

            // console.log("Today's events: ", filteredEvents);

            // Date to create (Today)
            const today = new Date();

            for (let i = 0; i < filteredEvents.length; i++) {
                const eventExists = await checkIfEventExists(filteredEvents[i]);
                const eventDate = new Date(filteredEvents[i].date);

                const hours = eventDate.getHours();
                const minutes = eventDate.getMinutes();
                const seconds = eventDate.getSeconds();
                const milliseconds = eventDate.getMilliseconds();

                const yearToday = today.getFullYear();
                const monthToday = today.getMonth();
                const dateToday = today.getDate();

                const newEventDate = new Date(yearToday, monthToday, dateToday, hours, minutes, seconds, milliseconds);
                // console.log('Today Date: ', newEventDate, '\n');

                const newEndTime = new Date(yearToday, monthToday, dateToday, hours + filteredEvents[i].hours, minutes, seconds, milliseconds)

                if (eventExists) {
                    return false;   // console.log("I'm not going to run ceateEvent")
                } else {
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
                            hflaWebsiteUrl: filteredEvents[i].project.hflaWebsiteUrl && filteredEvents[i].project.hflaWebsiteUrl,
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

            // For each recurring event, check to see if an event already exists for it
            // and do something if true/false 
            // filteredEvents.forEach(async (event) => {
            //     // console.log('Check if it exists: ', event);
            //     const eventExists = await checkIfEventExists(event.name);
            //     const eventDate = new Date(event.date);

            //     const hours = eventDate.getHours();
            //     const minutes = eventDate.getMinutes();
            //     const seconds = eventDate.getSeconds();
            //     const milliseconds = eventDate.getMilliseconds();

            //     const yearToday = today.getFullYear();
            //     const monthToday = today.getMonth();
            //     const dateToday = today.getDate();

            //     const newEventDate = new Date(yearToday, monthToday, dateToday, hours, minutes, seconds, milliseconds);
            //     // console.log('Today Date: ', newEventDate, '\n');

            //     const newEndTime = new Date(yearToday, monthToday, dateToday, hours + event.hours, minutes, seconds, milliseconds)

            //     if (eventExists) {
            //         return false;   // console.log("I'm not going to run ceateEvent")
            //     } else {
            //         const eventToCreate = {
            //             name: event.name && event.name,
            //             location: {
            //                 city: event.location.city && event.location.city,
            //                 state: event.location.state && event.location.state,
            //                 country: event.location.country && event.location.country
            //             },
            //             hacknight: event.hacknight && event.hacknight,
            //             eventType: event.eventType && event.eventType,
            //             description: event.eventDescription && event.eventDescription,
            //             project: event.project && {                                          
            //                 projectId: event.project.projectId ? event.project.projectId : '12345',
            //                 name: event.project.name && event.project.name,
            //                 videoConferenceLink: event.project.videoConferenceLink && event.project.videoConferenceLink,
            //                 githubIdentifier: event.project.githubIdentifier && event.project.githubIdentifier,
            //                 hflaWebsiteUrl: event.project.hflaWebsiteUrl && event.project.hflaWebsiteUrl,
            //                 githubUrl: event.project.githubUrl && event.project.githubUrl
            //             },
            //             date: event.date && newEventDate,
            //             startTime: event.startTime && newEventDate,
            //             endTime: event.endTime && newEndTime,
            //             hours: event.hours && event.hours
            //         }
            //         // console.log(eventToCreate);
            //         const created = await createEvent(eventToCreate);
            //         console.log(created);
            //     };
            // });
            };
        };
    };

    async function checkIfEventExists(eventName) {
        const events = EVENTS;
        const today = new Date();

        if (events && events.length > 0) {
            const filteredEvents = events.filter(event => {
                const eventDate = new Date(event.date);

                const year = eventDate.getFullYear();
                const month = eventDate.getMonth();
                const date = eventDate.getDate();

                const yearToday = today.getFullYear();
                const monthToday = today.getMonth();
                const dateToday = today.getDate();

                // console.log((year === yearToday && month === monthToday && date === dateToday && eventName === event.name));
                return (year === yearToday && month === monthToday && date === dateToday && eventName === event.name);
            });
            // console.log("Event's already created: ", filteredEvents);
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
                const response = await fetch(`${url}/api/events/`, options); 
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
        await filterAndCreateEvents(TODAY);

        console.log("Today's events are created");
    
    };

    // setTimeout(() => {
    //     runTask();
    // }, 5000);

    const scheduledTask = cron.schedule('*/1 0-18 * * *', () => {
        runTask();
    });

    return scheduledTask;
};