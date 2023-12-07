module.exports = (cron, fetch) => {

    // Check to see if any events are about to start,
    // and if so, open their respective check-ins

    const url = process.env.NODE_ENV === 'prod' ? 'https://www.vrms.io' : `http://localhost:${process.env.BACKEND_PORT}`;
    const headerToSend = process.env.CUSTOM_REQUEST_HEADER;

    async function fetchEvents() {
        try {
            const res = await fetch(`${url}/api/events`, {
                headers: {
                  "x-customrequired-header": headerToSend
                }
            });
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
                if (!event.date) {
                    // handle if event date is null/undefined
                    // false meaning don't include in sortedEvents
                    return false
                }

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

                await fetch(`${url}/api/events/${event._id}`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      "x-customrequired-header": headerToSend
                    },
                    body: JSON.stringify({ checkInReady: false })
                })
                    .catch(err => {
                        console.log(err);
                    });
            });
        };
    };

    async function runTask() {
        console.log("Closing check-ins");

        const eventsToClose = await sortAndFilterEvents()
            .catch(err => {console.log(err)});

        await closeCheckins(eventsToClose)
            .catch(err => {console.log(err)});

        console.log("Check-ins closed");
    };

    const scheduledTask = cron.schedule('*/30 * * * *', () => {
        runTask();
    });

    return scheduledTask;
};