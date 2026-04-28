/**
 * Timezone-correct event time utilities using Temporal API.
 *
 * All VRMS events are in America/Los_Angeles timezone. MongoDB stores dates
 * as UTC timestamps. These functions use Temporal to correctly convert
 * between UTC and LA time, handling DST transitions properly.
 *
 * Fixes: GitHub issue #1872
 */

import { Temporal } from '@js-temporal/polyfill';

const TZ = 'America/Los_Angeles';

/**
 * Get the day-of-week for an event's stored date, in LA time.
 * Returns JS-style day: 0=Sun, 1=Mon, ..., 6=Sat
 *
 * Temporal.ZonedDateTime.dayOfWeek is ISO: 1=Mon..7=Sun
 * Convert to JS convention with % 7 (7 % 7 = 0 = Sunday)
 */
export function getEventDayLA(event) {
  const instant = Temporal.Instant.fromEpochMilliseconds(
    new Date(event.date).getTime(),
  );
  const zdt = instant.toZonedDateTimeISO(TZ);
  return zdt.dayOfWeek % 7;
}

// Backward-compat alias
export const getEventDay = getEventDayLA;

/**
 * Get today's day-of-week in LA time.
 * Returns JS-style day: 0=Sun, 1=Mon, ..., 6=Sat
 */
export function getTodayDayLA() {
  return Temporal.Now.zonedDateTimeISO(TZ).dayOfWeek % 7;
}

/**
 * Generate a new event occurrence from a recurring event template.
 *
 * Extracts the time-of-day (in LA time) from the stored UTC timestamp,
 * combines it with today's date (in LA time), and returns JS Date objects.
 * This correctly handles DST transitions -- a 7pm PST event stays at 7pm PDT
 * after spring forward.
 *
 * @param {Object} filteredEvent - Recurring event with .date and .hours
 * @param {Date} todayDate - Today's date as a JS Date
 * @returns {{ newEventDate: Date, newEndTime: Date }}
 */
export function generateEventFromRecurring(filteredEvent, todayDate) {
  // Extract LA time-of-day from the stored UTC timestamp
  const storedInstant = Temporal.Instant.fromEpochMilliseconds(
    new Date(filteredEvent.date).getTime(),
  );
  const storedZdt = storedInstant.toZonedDateTimeISO(TZ);
  const eventTime = storedZdt.toPlainTime();

  // Get today's date in LA time
  const todayInstant = Temporal.Instant.fromEpochMilliseconds(
    todayDate.getTime(),
  );
  const todayZdt = todayInstant.toZonedDateTimeISO(TZ);
  const todayPlain = todayZdt.toPlainDate();

  // Combine today's LA date with the event's LA time
  const newStartZdt = todayPlain.toZonedDateTime({
    timeZone: TZ,
    plainTime: eventTime,
  });

  // End time = start + hours
  const newEndZdt = newStartZdt.add({ hours: filteredEvent.hours });

  return {
    newEventDate: new Date(newStartZdt.epochMilliseconds),
    newEndTime: new Date(newEndZdt.epochMilliseconds),
  };
}

/**
 * Check if two dates fall on the same calendar day in LA time.
 *
 * @param {Date|string} eventDate
 * @param {Date|string} referenceDate
 * @returns {boolean}
 */
export function checkIfSameDayLA(eventDate, referenceDate) {
  const eventInstant = Temporal.Instant.fromEpochMilliseconds(
    new Date(eventDate).getTime(),
  );
  const refInstant = Temporal.Instant.fromEpochMilliseconds(
    new Date(referenceDate).getTime(),
  );

  const eventPlain = eventInstant.toZonedDateTimeISO(TZ).toPlainDate();
  const refPlain = refInstant.toZonedDateTimeISO(TZ).toPlainDate();

  return eventPlain.equals(refPlain);
}

/**
 * Check if an event starts between now and 30 minutes from now.
 * Plain millisecond arithmetic -- no timezone conversion needed since
 * both values are absolute UTC instants.
 *
 * @param {Date|string} eventDate - Event start time
 * @param {Date|string} now - Current time
 * @returns {boolean}
 */
export function isInOpenWindow(eventDate, now) {
  const eventMs = new Date(eventDate).getTime();
  const nowMs = new Date(now).getTime();
  const thirtyMinMs = 30 * 60 * 1000;

  return eventMs >= nowMs && eventMs <= nowMs + thirtyMinMs;
}

/**
 * Check if 3 hours have passed since the event started.
 * Plain millisecond arithmetic -- no timezone conversion needed since
 * both values are absolute UTC instants.
 *
 * @param {Date|string} eventDate - Event start time
 * @param {Date|string} now - Current time
 * @returns {boolean}
 */
export function isPastCloseWindow(eventDate, now) {
  const eventMs = new Date(eventDate).getTime();
  const nowMs = new Date(now).getTime();
  const threeHoursMs = 3 * 60 * 60 * 1000;

  return nowMs >= eventMs + threeHoursMs;
}
