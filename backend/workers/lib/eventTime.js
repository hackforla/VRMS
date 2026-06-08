/**
 * Pure functions extracted from createRecurringEvents.js for testability.
 *
 * WARNING: These functions contain known timezone bugs (see GitHub issue #1872).
 * They use getDay()/getHours()/etc. which return values in the server's local
 * timezone, not in Los Angeles time. Do not "fix" them here — fixes belong in
 * the worker refactor tracked by that issue.
 */

/**
 * Get the day-of-week for an event's stored date.
 * Mirrors line 54 of createRecurringEvents.js.
 *
 * BUG: Uses getDay() which returns the day in the server's timezone,
 * not the event's intended timezone (America/Los_Angeles).
 */
export function getEventDay(event) {
  return new Date(event.date).getDay();
}

/**
 * Generate a new event occurrence from a recurring event template.
 * Mirrors lines 64-81 of createRecurringEvents.js.
 *
 * BUG: Uses getHours()/getMinutes()/etc. which extract time components
 * in the server's timezone, then constructs a new Date using those
 * components as local time. On a UTC server, a 7pm PST event (stored
 * as 3am UTC) gets hours=3, producing an event at 3am server-local
 * instead of 7pm LA time.
 */
export function generateEventFromRecurring(filteredEvent, TODAY_DATE) {
  const eventDate = new Date(filteredEvent.date);
  const hours = eventDate.getHours();
  const minutes = eventDate.getMinutes();
  const seconds = eventDate.getSeconds();
  const milliseconds = eventDate.getMilliseconds();

  const yearToday = TODAY_DATE.getFullYear();
  const monthToday = TODAY_DATE.getMonth();
  const dateToday = TODAY_DATE.getDate();

  const newEventDate = new Date(
    yearToday, monthToday, dateToday,
    hours, minutes, seconds, milliseconds,
  );

  const newEndTime = new Date(
    yearToday, monthToday, dateToday,
    hours + filteredEvent.hours, minutes, seconds, milliseconds,
  );

  return {
    newEventDate,
    newEndTime,
  };
}
