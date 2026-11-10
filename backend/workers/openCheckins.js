import adjustToLosAngelesTime from './lib/adjustToLosAngelesTime.js';

const THIRTY_MINUTES_MS = 1800000;

// --- Testable pure function (exported) ---

export function filterEventsToOpen(events, now) {
  if (!events || events.length === 0) return [];

  const laNow = adjustToLosAngelesTime(now);
  const laNowMs = laNow.getTime();
  const thirtyMinutesFromNow = laNowMs + THIRTY_MINUTES_MS;

  return events.filter((event) => {
    if (!event.date) return false;
    const eventDate = new Date(event.date);
    if (Number.isNaN(eventDate.getTime())) return false;
    const startMs = adjustToLosAngelesTime(eventDate).getTime();
    return startMs >= laNowMs && startMs <= thirtyMinutesFromNow && event.checkInReady === false;
  });
}

// --- Side-effectful functions ---

async function fetchEvents(url, headerToSend, fetch) {
  try {
    const res = await fetch(`${url}/api/events`, {
      headers: { 'x-customrequired-header': headerToSend },
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function updateEvents(url, headerToSend, fetch, eventsToUpdate) {
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

// --- Entrypoint ---

export default (cron, fetch) => {
  const url =
    process.env.NODE_ENV === 'prod'
      ? 'https://www.vrms.io'
      : `http://localhost:${process.env.BACKEND_PORT || 4000}`;
  const headerToSend = process.env.CUSTOM_REQUEST_HEADER ?? '';

  async function runTask() {
    console.log('Opening check-ins');

    const events = await fetchEvents(url, headerToSend, fetch);
    const eventsToOpen = filterEventsToOpen(events, new Date());

    if (eventsToOpen.length > 0) {
      const batchEventsToUpdate = eventsToOpen.map((e) => ({
        _id: e._id,
        checkInReady: true,
      }));
      const updatedEvents = await updateEvents(url, headerToSend, fetch, batchEventsToUpdate);
      if (updatedEvents) console.log('Updated events:', updatedEvents);
      console.log('Check-ins opened');
    } else {
      console.log('No scheduled events to open');
    }
  }

  return cron.schedule('*/30 * * * *', () => {
    runTask();
  });
};
