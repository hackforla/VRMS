export default (cron, fetch) => {
  const url =
    process.env.NODE_ENV === 'prod'
      ? 'https://www.vrms.io'
      : `http://localhost:${process.env.BACKEND_PORT}`;
  const headerToSend = process.env.CUSTOM_REQUEST_HEADER;

  async function fetchEvents() {
    try {
      const res = await fetch(`${url}/api/events`, {
        headers: {
          'x-customrequired-header': headerToSend,
        },
      });
      const resJson = await res.json();

      return resJson;
    } catch (error) {
      console.log(error);
    }
  }

  async function updateEvents(eventsToUpdate) {
    try {
      const res = await fetch(`${url}/api/events/batchUpdate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-customrequired-header': headerToSend,
        },
        body: JSON.stringify(eventsToUpdate),
      });
      if (!res.ok) throw new Error('Failed to update event');
      return await res.json();
    } catch (error) {
      console.error('Error updating event:', error);
      return null;
    }
  }

  async function sortAndFilterEvents() {
    const events = await fetchEvents();

    // Get current time and set to date variable
    const now = new Date();
    const laNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    const laNowMs = laNow.getTime();
    // Filter events if event date is after now but before thirty minutes from now
    if (events && events.length > 0) {
      const sortedEvents = events.filter((event) => {
        if (!event.date) {
          // handle if event date is null/undefined
          // false meaning don't include in sortedEvents
          return false;
        }
        const threeHoursFromStartTime = new Date(event.date).getTime() + 10800000;
        if (Number.isNaN(threeHoursFromStartTime)) return false;
        return laNowMs >= threeHoursFromStartTime && event.checkInReady === true;
      });

      return sortedEvents;
    }
  }

  async function closeCheckins(events) {
    if (events && events.length > 0) {
      console.log('Closing check-ins');
      const batchEventsToUpdate = events.map((e) => ({
        _id: e._id,
        checkInReady: false,
      }));
      const updatedEvents = await updateEvents(batchEventsToUpdate);
      if (updatedEvents) console.log('Updated events:', updatedEvents);
      console.log('Check-ins closed');
    } else {
      console.log('No open events to close');
    }
  }

  async function runTask() {
    const eventsToClose = await sortAndFilterEvents().catch((err) => {
      console.log(err);
    });

    await closeCheckins(eventsToClose).catch((err) => {
      console.log(err);
    });
  }

  const scheduledTask = cron.schedule('*/30 * * * *', () => {
    runTask();
  });

  return scheduledTask;
};
