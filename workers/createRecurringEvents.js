module.exports = (cron, fetch) => {

    // Check to see if any events are about to start, 
    // and if so, open their respective check-ins

    const TODAY = new Date().getDay();

    const EVENTS = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/events");
            const resJson = await res.json();

            return resJson;
        } catch(error) {
            console.log(error);
        };
    };

    const RECURRING_EVENTS = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/recurringevents");
            const resJson = await res.json();

            return resJson;
        } catch(error) {
            console.log(error);
        };
    };

    async function getAndFilterEvents(today) {
        const recurringEvents = await RECURRING_EVENTS();

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
                
                eventExists ? console.log("I'm not going to run the function") : createEvent(event);
            });
        };
    };

    async function checkIfEventExists(eventName) {
        const events = await EVENTS();

        if (events && events.length > 0) {
            const filteredEvents = events.filter(event => {
                const eventDate = new Date(event.date).getDate();
                const today = new Date();
                const todayDate = today.getDate();

                return (eventDate === todayDate && eventName === event.name);
            });

            return filteredEvents.length > 0 ? true : false;
        };
    };
    
    async function createEvent(event) {
        if(event) {
            // console.log('Opening event: ', event);
            const jsonEvent = JSON.stringify(event);

            // await fetch(`https://vrms.io/api/events`, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: jsonEvent
            // })
            //     .catch(err => {
            //         console.log(err);
            //     });
        };
    };
    
    // async function runTask() {
    //     console.log("I'm going to open check-ins");

    //     // Get current time and set to date variable
    //     const currentTimeISO = new Date().toISOString();

    //     // Calculate thirty minutes from now
    //     const thirtyMinutesFromNow = new Date().getTime() + 1800000;
    //     const thirtyMinutesISO = new Date(thirtyMinutesFromNow).toISOString();

    //     const eventsToOpen = await getAndFilterEvents(currentTimeISO, thirtyMinutesISO);
    //     await createEvents(eventsToOpen);

    //     console.log("I finished opening check-ins");
    setTimeout(() => {
        getAndFilterEvents(TODAY);
    }, 5000);
    // };

    // const scheduledTask = cron.schedule('*/10 7-21 * * *', () => {
    //     runTask();
    // });

    // createEvents(events);

    // return scheduledTask;
};