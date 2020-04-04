module.exports = (cron, fetch) => {

    // Check to see if any events are about to start, and if so, 
    // open their respective check-ins
    
    async function fetchEvents() {
        console.log("\n Fetching events \n");
    
        try {
            const res = await fetch("http://localhost:4000/api/events");
            const resJson = await res.json();

            return resJson;
        } catch(error) {
            console.log(error);
        };
    };

    async function sortAndFilterEvents(currentTime, thirtyMinutes) {
        console.log("\n Sorting events \n");

        const events = await fetchEvents();

        // Filter events if event date is after now but before thirty minutes from now
        const sortedEvents = events.filter(event => {
            return (event.date > currentTime) && (event.date < thirtyMinutes);
        })

        return sortedEvents;
    };

    async function openCheckins(events) {
        events.forEach(event => {
            console.log('Opening event: ', event);
        })
    }

    // Open the events for check-in
    // async function fetchEvents() {
    //     console.log("I'm working");
    
    //     try {
    //         const res = await fetch("http://localhost:4000/api/events");
    //         const resJson = await res.json();
    //         console.log(resJson);
    //     } catch(error) {
    //         console.log(error);
    //     };
    // };
    
    async function runTask() {
        console.log("I'm going to work");

        // Get current time and set to date variable
        const currentTimeISO = new Date().toISOString();
        const thirtyMinutesFromNow = new Date().getTime() + 1800000;
        const thirtyMinutesISO = new Date(thirtyMinutesFromNow).toISOString();
        console.log("\n Current time:", currentTimeISO, "\n Current time + 30:", thirtyMinutesISO);

        const eventsToOpen = await sortAndFilterEvents(currentTimeISO, thirtyMinutesISO);
        await openCheckins(eventsToOpen);

        console.log("I finished working");
    };

    const scheduledTask = cron.schedule('*/15 * * * * *', () => {
        runTask();
    });

    return scheduledTask;
};