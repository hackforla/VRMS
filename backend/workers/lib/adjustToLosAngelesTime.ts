// Extracted from createRecurringEvents.js for shared use across workers.
// Converts a UTC date to LA local time by computing the current UTC offset
// for America/Los_Angeles (handles PST/PDT automatically).
const adjustToLosAngelesTime = (eventDate: Date | string): Date => {
  const tempDate = new Date(eventDate);
  const losAngelesOffsetHours = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    timeZoneName: 'shortOffset',
  })
    .formatToParts(tempDate)
    .find((part) => part.type === 'timeZoneName')!
    .value.slice(3);
  const offsetMinutes = parseInt(losAngelesOffsetHours, 10) * 60;
  return new Date(tempDate.getTime() + offsetMinutes * 60000);
};

export default adjustToLosAngelesTime;
