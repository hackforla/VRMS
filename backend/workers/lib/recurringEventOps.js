/**
 * Pure-data operations on recurring events.
 *
 * These functions encapsulate the filtering, building, and duplicate-detection
 * logic that the `createRecurringEvents` worker used to inline. They contain
 * no HTTP, no DB, no I/O — only deterministic transformations over plain
 * event objects so they can be unit-tested in isolation.
 *
 * All timezone-correct comparisons delegate to `./eventTime.js`.
 *
 * Related: GitHub issue #1872.
 */

import {
  getEventDayLA,
  getTodayDayLA,
  generateEventFromRecurring,
  checkIfSameDayLA,
} from './eventTime.js';

/**
 * Filter a list of recurring events down to the ones whose day-of-week
 * (in America/Los_Angeles) matches `todayDate`'s day-of-week (also in LA).
 *
 * @param {Array<Object>} recurringEvents - Recurring event documents (need `.date`)
 * @param {Date} todayDate - JS Date representing "now"
 * @returns {Promise<Array<Object>>} subset of `recurringEvents` whose day matches
 */
export async function filterTodaysRecurringEvents(recurringEvents, todayDate) {
  if (!Array.isArray(recurringEvents) || recurringEvents.length === 0) {
    return [];
  }
  const todayDay = getTodayDayLA(todayDate);
  return recurringEvents.filter((event) => getEventDayLA(event) === todayDay);
}

/**
 * Build the event payload that should be POSTed to `/api/events/` from a
 * recurring-event template and today's date.
 *
 * The returned shape mirrors what `createRecurringEvents.filterAndCreateEvents`
 * historically constructed before delegating to `createEvent()`:
 * `{ name, hacknight, eventType, description, project, date, startTime, endTime, hours, location? }`.
 *
 * @param {Object} filteredEvent - Recurring event template
 * @param {Date} todayDate - JS Date representing "now"
 * @returns {Promise<Object>} New event payload
 */
export async function buildNewEvent(filteredEvent, todayDate) {
  const { newEventDate, newEndTime } = generateEventFromRecurring(
    filteredEvent,
    todayDate,
  );

  const eventToCreate = {
    name: filteredEvent.name && filteredEvent.name,
    hacknight: filteredEvent.hacknight && filteredEvent.hacknight,
    eventType: filteredEvent.eventType && filteredEvent.eventType,
    description:
      filteredEvent.eventDescription && filteredEvent.eventDescription,
    project: filteredEvent.project && filteredEvent.project,
    date: filteredEvent.date && newEventDate,
    startTime: filteredEvent.startTime && newEventDate,
    endTime: filteredEvent.endTime && newEndTime,
    hours: filteredEvent.hours && filteredEvent.hours,
  };

  if (
    filteredEvent &&
    Object.prototype.hasOwnProperty.call(filteredEvent, 'location')
  ) {
    const loc = filteredEvent.location || {};
    eventToCreate.location = {
      city: loc.city ? loc.city : 'REMOTE',
      state: loc.state ? loc.state : 'REMOTE',
      country: loc.country ? loc.country : 'REMOTE',
    };
  }

  return eventToCreate;
}

/**
 * Determine whether an event with `eventName` already exists on `todayDate`
 * (LA calendar day) in the supplied `existingEvents` list.
 *
 * @param {string} eventName
 * @param {Array<Object>} existingEvents - Already-created events (need `.name`, `.date`)
 * @param {Date} todayDate
 * @returns {boolean}
 */
export function isEventDuplicate(eventName, existingEvents, todayDate) {
  if (!Array.isArray(existingEvents) || existingEvents.length === 0) {
    return false;
  }
  return existingEvents.some(
    (event) =>
      event &&
      event.name === eventName &&
      checkIfSameDayLA(event.date, todayDate),
  );
}
