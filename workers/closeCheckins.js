module.exports = (cron, fetch) => {

    // Check to see if any events are about to start, 
    // and if so, open their respective check-ins
    
    async function fetchEvents() {    
        try {
            const res = await fetch("https://vrms.io/api/events");
            const resJson = await res.json();

            return resJson;
        } catch(error) {
            console.log(error);
        };
    };

    async function sortAndFilterEvents() {
        const events = await fetchEvents();

        // Filter events if event date is after now but before thirty minutes from now
        if (events && events.length > 0) {
            
            const sortedEvents = events.filter(event => {
                const currentTimeISO = new Date().toISOString();
                const threeHoursFromStartTime = new Date(event.date).getTime() + 10800000;
                const threeHoursISO = new Date(threeHoursFromStartTime).toISOString();

                return (currentTimeISO > threeHoursISO) && (event.checkInReady === true);
            });

            // console.log('Sorted events: ', sortedEvents);
            return sortedEvents;
        };
    };
    
    async function closeCheckins(events) {
        if(events && events.length > 0) {
            events.forEach(async event => {
                // console.log('Closing event: ', event);

                await fetch(`https://vrms.io/api/events/${event._id}`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json"
                    }
                })
                    .catch(err => {
                        console.log(err);
                    });
            });
        };
    };
    
    async function runTask() {
        console.log("Closing check-ins");

        const eventsToClose = await sortAndFilterEvents();
        // console.log(eventsToClose);
        await closeCheckins(eventsToClose);

        console.log("Check-ins closed");
    };

    const scheduledTask = cron.schedule('*/10 8-23 * * *', () => {
        runTask();
    });

    return scheduledTask;
};