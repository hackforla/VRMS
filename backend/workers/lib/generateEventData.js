/**
 * @typedef {Object} RecurringEventObj
 * Input shape for generateEventData. `startTime` and `hours` are required;
 * all other fields are passed through to the output unchanged.
 * @property {string | Date} startTime - Event start time; used to extract local h/m/s
 * @property {number} hours - Duration in hours; used to compute endTime
 * @property {string} [name]
 * @property {string} [hacknight]
 * @property {string} [eventType]
 * @property {string} [eventDescription]
 * @property {Object} [project]
 * @property {string | Date} [date]
 * @property {string | Date} [endTime]
 * @property {{ city?: string, state?: string, country?: string }} [location]
 */

/**
 * @typedef {Object} EventDataResult
 * Output of generateEventData — same fields as RecurringEventObj but with
 * `date`, `startTime`, and `endTime` replaced by computed JS Date objects.
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
 */

/**
 * Build a new event document from a recurring event template and a reference date.
 *
 * Extracts the local time components (h/m/s/ms) from `eventObj.startTime` and
 * applies them to `TODAY_DATE` to produce the new `date` and `startTime`.
 * `endTime` is computed by adding `eventObj.hours` to the start hour.
 *
 * NOTE: This uses local (system) time arithmetic, not timezone-aware Temporal.
 * For DST-correct handling prefer `generateEventFromRecurring` in eventTime.js.
 *
 * @param {RecurringEventObj} eventObj - Recurring event template
 * @param {Date} [TODAY_DATE=new Date()] - Reference date for the new occurrence
 * @returns {EventDataResult}
 */
function generateEventData(eventObj, TODAY_DATE = new Date()) {
  const eventDate = new Date(eventObj.startTime);
  const hours = eventDate.getHours();
  const minutes = eventDate.getMinutes();
  const seconds = eventDate.getSeconds();
  const milliseconds = eventDate.getMilliseconds();

  const yearToday = TODAY_DATE.getFullYear();
  const monthToday = TODAY_DATE.getMonth();
  const dateToday = TODAY_DATE.getDate();

  const newEventDate = new Date(
    yearToday,
    monthToday,
    dateToday,
    hours,
    minutes,
    seconds,
    milliseconds,
  );

  const newEndTime = new Date(
    yearToday,
    monthToday,
    dateToday,
    hours + eventObj.hours,
    minutes,
    seconds,
    milliseconds,
  );

  const eventToCreate = {
    name: eventObj.name && eventObj.name,
    hacknight: eventObj.hacknight && eventObj.hacknight,
    eventType: eventObj.eventType && eventObj.eventType,
    description: eventObj.eventDescription && eventObj.eventDescription,
    project: eventObj.project && eventObj.project,
    date: eventObj.date && newEventDate,
    startTime: eventObj.startTime && newEventDate,
    endTime: eventObj.endTime && newEndTime,
    hours: eventObj.hours && eventObj.hours,
  };

  if (eventObj.hasOwnProperty('location')) {
    eventToCreate.location = {
      city: eventObj.location.city ? eventObj.location.city : 'REMOTE',
      state: eventObj.location.state ? eventObj.location.state : 'REMOTE',
      country: eventObj.location.country ? eventObj.location.country : 'REMOTE',
    };
  }

  return eventToCreate;
}

export { generateEventData };
