module.exports = (cron, fetch) => {
  // Check to see if any events are about to start,
  // and if so, open their respective check-ins

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
    const now = Date.now();

    // Calculate thirty minutes from now
    const thirtyMinutesFromNow = now + 1800000;

    // Filter events if event date is after now but before thirty minutes from now
    if (events && events.length > 0) {
      const sortedEvents = events.filter((event) => {
        if (!event.date) {
          // handle if event date is null/undefined
          // false meaning don't include in sortedEvents
          return false;
        }
        const startMs = new Date(event.date).getTime();
        if (Number.isNaN(startMs)) return false;
        return startMs >= now && startMs <= thirtyMinutesFromNow && event.checkInReady === false;
      });
      // console.log('Sorted events: ', sortedEvents);
      return sortedEvents;
    }
  }

  async function openCheckins(events) {
    if (events && events.length > 0) {
      console.log('Opening check-ins');
      // console.log('Opening event: ', event);
      const batchEventsToUpdate = events.map((e) => ({
        _id: e._id,
        checkInReady: true,
      }));
      const updatedEvents = await updateEvents(batchEventsToUpdate);
      if (updatedEvents) console.log('Updated events:', updatedEvents);
      console.log('Check-ins opened');
    } else {
      console.log('No scheduled events to open');
    }
  }

  async function runTask() {
    const eventsToOpen = await sortAndFilterEvents().catch((err) => {
      console.log(err);
    });

    await openCheckins(eventsToOpen).catch((err) => {
      console.log(err);
    });
  }

  const scheduledTask = cron.schedule('*/30 * * * *', () => {
    runTask();
  });

  return scheduledTask;
};
