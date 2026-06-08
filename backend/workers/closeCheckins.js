module.exports = (cron, fetch) => {

    // Check to see if any events are about to start,
    // and if so, open their respective check-ins

    const url = process.env.NODE_ENV === 'prod' ? 'https://www.vrms.io' : 'http://localhost:4000';
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
        const { isPastCloseWindow } = await import('./lib/eventTime.js');
        const events = await fetchEvents();

        // Filter events where 3 hours have passed since start and check-in is still open
        if (events && events.length > 0) {

            const sortedEvents = events.filter(event => {
                return isPastCloseWindow(event.date, new Date()) && (event.checkInReady === true);
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