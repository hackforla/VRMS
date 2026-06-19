import { isPastCloseWindow } from './lib/eventTime.js';

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

    if (events && events.length > 0) {
      return events.filter(
        (event) => event.date && event.checkInReady && isPastCloseWindow(event.date, new Date()),
      );
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
