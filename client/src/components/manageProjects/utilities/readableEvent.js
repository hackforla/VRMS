const readableEvent = (e) => {
  // This translates the data from the database into human
  // readable format that can be displayed

  // Get date for each of the parts of the event time/day
  const d = new Date(e.date);
  const start = new Date(e.startTime);
  const end = new Date(e.endTime);

  // Get day of the week. (Get the day number for sorting)
  const options = { weekday: 'long' };
  const dayOfTheWeek = Intl.DateTimeFormat('en-US', options).format(d);
  const dayOfTheWeekNumber = d.getDay();

  // Convert end time from 24 to 12 and make pretty
  const sHours = start.getHours();
  const startHours = sHours % 12 || 12;
  const startMinutes =
    (start.getMinutes() < 10 ? '0' : '') + start.getMinutes();
  const startAorP = sHours >= 12 ? 'pm' : 'am';
  const startTime = `${startHours}:${startMinutes}${startAorP}`;

  // Convert end time from 24 to 12 and make pretty
  const eHours = end.getHours();
  const endHours = eHours % 12 || 12;
  const endMinutes = (end.getMinutes() < 10 ? '0' : '') + end.getMinutes();
  const endAorP = eHours >= 12 ? 'pm' : 'am';
  const endTime = `${endHours}:${endMinutes}${endAorP}`;

  // Create readable object for this event
  const newEvent = {
    name: e.name,
    description: e.description,
    eventType: e.eventType,
    dayOfTheWeekNumber,
    dayOfTheWeek,
    startTime,
    endTime,
    duration: e.hours,
    // eslint-disable-next-line no-underscore-dangle
    event_id: e._id,
    videoConferenceLink: e.videoConferenceLink,
  };
  return newEvent;
};

export default readableEvent;
