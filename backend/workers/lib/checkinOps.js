/**
 * Pure-data operations on the checkin pipeline.
 *
 * Encapsulates the filter used by the `openCheckins` worker so it can be
 * unit-tested without HTTP or DB. The factory continues to own fetching
 * and PATCHing.
 *
 * Related: GitHub issue #1872.
 */

import { isInOpenWindow } from './eventTime.js';

/**
 * @typedef {{ date: string | Date, checkInReady: boolean }} CheckInEvent
 * Minimum event shape required by the check-in pipeline.
 */

/**
 * Filter a list of events down to those whose checkin window is open right now.
 *
 * "Open" means:
 *   - the event's `checkInReady` flag is still `false` (not yet opened), AND
 *   - `isInOpenWindow(event.date, currentTime)` returns true (event starts
 *     within the next 30 minutes).
 *
 * @param {CheckInEvent[]} events - Event documents
 * @param {Date} currentTime - JS Date representing "now"
 * @returns {Promise<CheckInEvent[]>} Subset of `events` that should be opened
 */
export async function filterEventsInOpenWindow(events, currentTime) {
  if (!Array.isArray(events) || events.length === 0) {
    return [];
  }
  return events.filter(
    (event) =>
      event &&
      event.checkInReady === false &&
      isInOpenWindow(event.date, currentTime),
  );
}
