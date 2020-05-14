module.exports = (cron, fetch) => {

    // Check to see if any events are about to start, 
    // and if so, open their respective check-ins
    
    async function fetchEvents() {    
        try {
            const res = await fetch("https://vrms.io/api/events");
            // const res = await fetch("http://localhost:4000/api/events");
            const resJson = await res.json();

            return resJson;
        } catch(error) {
            console.log(error);
        };
    };

    async function sortAndFilterEvents(currentTime, thirtyMinutes) {
        const events = await fetchEvents();

        // Filter events if event date is after now but before thirty minutes from now
        if (events && events.length > 0) {
            const sortedEvents = events.filter(event => {
                return (event.date > currentTime) && (event.date < thirtyMinutes) && (event.checkInReady === false);
            })
            // console.log('Sorted events: ', sortedEvents);
            return sortedEvents;
        };
    };
    
    async function openCheckins(events) {
        if(events && events.length > 0) {
            events.forEach(event => {
                // console.log('Opening event: ', event);

                fetch(`https://vrms.io/api/events/${event._id}`, {
                // fetch(`http://localhost:4000/api/events/${event._id}`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json"
                    }
                })
                    .then(res => {
                        const response = res;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
        };
    };
    
    async function runTask() {
        console.log("Opening check-ins");

        // Get current time and set to date variable
        const currentTimeISO = new Date().toISOString();

        // Calculate thirty minutes from now
        const thirtyMinutesFromNow = new Date().getTime() + 1800000;
        const thirtyMinutesISO = new Date(thirtyMinutesFromNow).toISOString();

        const eventsToOpen = await sortAndFilterEvents(currentTimeISO, thirtyMinutesISO);
        await openCheckins(eventsToOpen);

        console.log("Check-ins opened");
    };

    const scheduledTask = cron.schedule('*/10 7-21 * * *', () => {
        runTask();
    });

    return scheduledTask;
};