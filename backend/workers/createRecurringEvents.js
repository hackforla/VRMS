import { generateEventData } from './lib/generateEventData.js';

//API CALLS to GET and POST
const fetchData = async (endpoint, URL, headerToSend, fetch) => {
  try {
    const res = await fetch(`${URL}${endpoint}`, {
      headers: { 'x-customrequired-header': headerToSend },
    });
    if (!res?.ok) throw new Error(`Failed to fetch: ${endpoint}`);
    return await res.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
};

const createEvents = async (eventArray, URL, headerToSend, fetch) => {
  if (!eventArray) return null;

  try {
    const res = await fetch(`${URL}/api/events/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-customrequired-header': headerToSend,
      },
      body: JSON.stringify(eventArray),
    });
    if (!res.ok) throw new Error('Failed to create event');
    return await res.json();
  } catch (error) {
    console.error('Error creating event:', error);
    return null;
  }
};

const isSameUTCDate = (eventDate, todayDate) => {
  return (
    eventDate.getUTCFullYear() === todayDate.getUTCFullYear() &&
    eventDate.getUTCMonth() === todayDate.getUTCMonth() &&
    eventDate.getUTCDate() === todayDate.getUTCDate()
  );
};

const doesEventExist = (recurringEventName, today, events) =>
  events.some((event) => {
    const eventDate = new Date(event.date);
    return isSameUTCDate(eventDate, today) && event.name === recurringEventName;
  });

const adjustToLosAngelesTime = (eventDate) => {
  const tempDate = new Date(eventDate);
  const losAngelesOffsetHours = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    timeZoneName: 'shortOffset',
  })
    .formatToParts(tempDate)
    .find((part) => part.type === 'timeZoneName')
    .value.slice(3);
  const offsetMinutes = parseInt(losAngelesOffsetHours, 10) * 60;
  return new Date(tempDate.getTime() + offsetMinutes * 60000);
};

const filterAndCreateEvents = async (events, recurringEvents, URL, headerToSend, fetch) => {
  const today = new Date();
  const todayUTCDay = today.getUTCDay();

  const eventsToCreate = recurringEvents?.filter((recurringEvent) => {
    const localEventDate = adjustToLosAngelesTime(recurringEvent.date);
    return (
      localEventDate.getUTCDay() === todayUTCDay &&
      !doesEventExist(recurringEvent.name, today, events)
    );
  });

  if (!eventsToCreate || eventsToCreate?.length === 0) {
    return 'No events for today.';
  } else {
    const batchEvents = [];
    for (const event of eventsToCreate) {
      const correctedStartTime = adjustToLosAngelesTime(event.startTime);
      const timeCorrectedEvent = {
        ...event,
        date: correctedStartTime.toISOString(),
        startTime: correctedStartTime.toISOString(),
      };
      const eventToCreate = generateEventData(timeCorrectedEvent);
      batchEvents.push(eventToCreate);
    }
    const createdEvents = await createEvents(batchEvents, URL, headerToSend, fetch);
    if (createdEvents) console.log('Created events:', createdEvents);
    return "Today's events have been created.";
  }
};

const runTask = async (fetch, URL, headerToSend) => {
  console.log("Creating today's events...");
  const [events, recurringEvents] = await Promise.all([
    fetchData('/api/events/', URL, headerToSend, fetch),
    fetchData('/api/recurringevents/', URL, headerToSend, fetch),
  ]);

  const checkAndCreateEvents = await filterAndCreateEvents(
    events,
    recurringEvents,
    URL,
    headerToSend,
    fetch,
  );
  console.log(checkAndCreateEvents);
};

const scheduleTask = (cron, fetch, URL, headerToSend) => {
  return cron.schedule('*/30 * * * *', () => {
    runTask(fetch, URL, headerToSend).catch((error) => console.error('Error running task:', error));
  });
};

const createRecurringEvents = (cron, fetch) => {
  const URL =
    process.env.NODE_ENV === 'prod'
      ? 'https://www.vrms.io'
      : `http://localhost:${process.env.BACKEND_PORT}`;
  const headerToSend = process.env.CUSTOM_REQUEST_HEADER;

  return scheduleTask(cron, fetch, URL, headerToSend);
};

export {
  createRecurringEvents,
  fetchData,
  adjustToLosAngelesTime,
  isSameUTCDate,
  doesEventExist,
  createEvents,
  filterAndCreateEvents,
  runTask,
  scheduleTask,
};

export default createRecurringEvents;
