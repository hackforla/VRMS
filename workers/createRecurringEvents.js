module.exports = (cron, fetch) => {

    // Check to see if any recurring events are happening today, 
    // and if so, check to see if an event has already been created
    // for it. If not, create one.

    const TODAY = new Date().getDay();
    let EVENTS;
    let RECURRING_EVENTS;

    const fetchEvents = async () => {
        try {
            // const res = await fetch("https://vrms.io/api/events");
            const res = await fetch("http://localhost:4000/api/events");
            EVENTS = await res.json();

            // return EVENTS;
        } catch(error) {
            console.log(error);
        };
    };

    const fetchRecurringEvents = async () => {
        try {
            // const res = await fetch("https://vrms.io/api/recurringevents");
            const res = await fetch("http://localhost:4000/api/recurringevents");
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

            // Date to create (Today)
            // const today = new Date().toISOString();
            const today = new Date().getDate();
            const newToday = new Date(today);
            console.log(newToday);
            console.log('Today is: ', today);
            const todayDateSliced = today.slice(0, 10);
            console.log('Today sliced is: ', todayDateSliced);

            // For each recurring event, check to see if an event already exists for it
            // and do something if true/false 
            filteredEvents.forEach(async (event) => {
                // console.log('Check if it exists: ', event);
                const eventExists = await checkIfEventExists(event.name);
                // console.log(eventExists);

                // Start time to create (Event's start time)
                const startTimeSliced = event.startTime.slice(10, event.startTime.length);
                // End time to create (Event's end time)
                const endTimeSliced = event.endTime.slice(10, event.endTime.length);

                // const testDate = event.date;
                const eventDate = todayDateSliced + startTimeSliced;
                const eventStartTime = eventDate;
                const eventEndTime = todayDateSliced + endTimeSliced;
                // console.log('Recurring event date: ', testDate);
                console.log('Before: ', eventDate);
                console.log('After: ', new Date(eventDate).toISOString());
                // console.log('Event info: ', eventDate, eventStartTime, eventEndTime);

                // if (eventExists) {
                //     return false;   // console.log("I'm not going to run ceateEvent")
                // } else {
                //     const eventToCreate = {
                //         name: event.name && event.name,
                //         location: {
                //             city: event.location.city && event.location.city,
                //             state: event.location.state && event.location.state,
                //             country: event.location.country && event.location.country
                //         },
                //         hacknight: event.hacknight && event.hacknight,
                //         eventType: event.eventType && event.eventType,
                //         description: event.eventDescription && event.eventDescription,
                //         project: event.project && {                                          
                //             projectId: event.project.projectId ? event.project.projectId : '12345',
                //             name: event.project.name && event.project.name,
                //             videoConferenceLink: event.project.videoConferenceLink && event.project.videoConferenceLink,
                //             githubIdentifier: event.project.githubIdentifier && event.project.githubIdentifier,
                //             hflaWebsiteUrl: event.project.hflaWebsiteUrl && event.project.hflaWebsiteUrl,
                //             githubUrl: event.project.githubUrl && event.project.githubUrl
                //         },
                //         date: event.date && eventDate,
                //         startTime: event.startTime && eventStartTime,
                //         endTime: event.endTime && eventEndTime,
                //         hours: event.hours && event.hours
                //     }
                //     // console.log(eventToCreate);
                //     createEvent(eventToCreate);
                // }
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
                // console.log(todayDateSliced);
                // console.log('TRUE OR FALSE', eventDateSliced === todayDateSliced);
                return (eventDateSliced === todayDateSliced && eventName === event.name);
            });
            // console.log("Today's events: ", filteredEvents);
            return filteredEvents.length > 0 ? true : false;
        };
    };
    
    async function createEvent(event) {
        if(event) {
            // console.log('Creating event: ', event);
            const jsonEvent = JSON.stringify(event);
            console.log('Running createEvent: ', jsonEvent);

            // try {
            //     // await fetch(`https://vrms.io/api/events`, {
            //     await fetch('http://localhost:4000/api/events', {
            //         method: "POST",
            //         headers: {
            //             "Content-Type": "application/json"
            //         },
            //         body: jsonEvent
            //     })
            //         .catch(err => {
            //             console.log(err);
            //         });
            // } catch (error) {
            //     console.log(error);
            // };
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

    // const scheduledTask = cron.schedule('*/1 1-16 * * *', () => {
        // runTask();
    // });

    // return scheduledTask;
};