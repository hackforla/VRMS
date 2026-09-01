import { filterEventsInOpenWindow } from './lib/checkinOps.js';

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

  async function sortAndFilterEvents(currentTime) {
    const events = await fetchEvents();

    if (events && events.length > 0) {
      return filterEventsInOpenWindow(events, currentTime);
    }
    return [];
  }

  async function openCheckins(events) {
    if (events && events.length > 0) {
      console.log('Opening check-ins');
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
    console.log('Opening check-ins');

    const currentTime = new Date();

    const eventsToOpen = await sortAndFilterEvents(currentTime);
    await openCheckins(eventsToOpen);

    console.log('Check-ins opened');
  }

  const scheduledTask = cron.schedule('*/30 * * * *', () => {
    runTask();
  });

  return scheduledTask;
};
