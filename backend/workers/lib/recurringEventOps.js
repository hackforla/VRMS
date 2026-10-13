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
 * @typedef {Object} RecurringEvent
 * @property {string} [_id] - MongoDB ObjectId (used to link created events back)
 * @property {string | Date} date - Stored UTC timestamp for the recurring event
 * @property {number} [hours] - Event duration in hours
 * @property {string} [name] - Event name
 * @property {string} [hacknight] - Hacknight identifier
 * @property {string} [eventType] - Event type label
 * @property {string} [eventDescription] - Human-readable description
 * @property {Object} [project] - Associated project document
 * @property {string | Date} [startTime] - Start time (may differ from date)
 * @property {string | Date} [endTime] - End time
 * @property {{ city?: string, state?: string, country?: string }} [location]
 */

/**
 * @typedef {Object} NewEventPayload
 * Shape POSTed to /api/events/ when creating a new occurrence.
 * @property {string} [name]
 * @property {string} [hacknight]
 * @property {string} [eventType]
 * @property {string} [description]
 * @property {Object} [project]
 * @property {Date} [date]
 * @property {Date} [startTime]
 * @property {Date} [endTime]
 * @property {number} [hours]
 * @property {{ city: string, state: string, country: string }} [location]
 * @property {{ recurringEventId: string }} [recurringEventLink]
 */

/**
 * Filter a list of recurring events down to the ones whose day-of-week
 * (in America/Los_Angeles) matches `todayDate`'s day-of-week (also in LA).
 *
 * @param {RecurringEvent[]} recurringEvents
 * @param {Date} todayDate - JS Date representing "now"
 * @returns {Promise<RecurringEvent[]>} Subset whose day-of-week matches today
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
 * @param {RecurringEvent} filteredEvent - Recurring event template
 * @param {Date} todayDate - JS Date representing "now"
 * @returns {Promise<NewEventPayload>}
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
    recurringEventLink: {
      recurringEventId: filteredEvent._id?.toString(),
    },
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
 * Determine whether an occurrence of `recurringEvent` already exists on
 * `todayDate` (LA calendar day) in the supplied `existingEvents` list.
 *
 * Matching strategy (in priority order):
 *   1. `recurringEventLink.recurringEventId` match — survives event renames.
 *   2. Name + same LA calendar day — fallback for events created before the
 *      `recurringEventLink` field was introduced.
 *
 * @param {RecurringEvent} recurringEvent
 * @param {Array<{ name: string, date: string | Date, recurringEventLink?: { recurringEventId?: string } }>} existingEvents
 * @param {Date} todayDate
 * @returns {boolean}
 */
export function isEventDuplicate(recurringEvent, existingEvents, todayDate) {
  if (!Array.isArray(existingEvents) || existingEvents.length === 0) {
    return false;
  }
  const recurringId = recurringEvent._id?.toString();
  return existingEvents.some((event) => {
    if (!event) return false;
    if (recurringId && event.recurringEventLink?.recurringEventId) {
      return (
        event.recurringEventLink.recurringEventId === recurringId &&
        checkIfSameDayLA(event.date, todayDate)
      );
    }
    return event.name === recurringEvent.name && checkIfSameDayLA(event.date, todayDate);
  });
}
