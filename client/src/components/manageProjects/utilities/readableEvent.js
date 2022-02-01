export const readableEvent = (e) => {

	// This translates the data from the database into human 
	// readable format that can be displayed

	// Get date for each of the parts of the event time/day   
	let d = new Date(e.date);
	let start = new Date(e.startTime);
	let end = new Date(e.endTime);

	//Get day of the week. (Get the day number for sorting)
	let options = { weekday: "long" };
	let dayOfTheWeek = Intl.DateTimeFormat("en-US", options).format(d);
	let dayOfTheWeekNumber = d.getDay();

	// Convert end time from 24 to 12 and make pretty
	let sHours = start.getHours();
	let startHours = (sHours % 12) || 12;
	let startMinutes = (start.getMinutes() < 10 ? '0' : '') + start.getMinutes();
	let startAorP = sHours >= 12 ? 'pm' : 'am';
	let startTime = startHours + ":" + startMinutes + startAorP;

	// Convert end time from 24 to 12 and make pretty
	let eHours = end.getHours();
	let endHours = (eHours % 12) || 12;
	let endMinutes = (end.getMinutes() < 10 ? '0' : '') + end.getMinutes();
	let endAorP = eHours >= 12 ? 'pm' : 'am';
	let endTime = endHours + ":" + endMinutes + endAorP;

	// Create readable object for this event
	let newEvent = {
		name: e.name,
		description: e.description,
		eventType: e.eventType,
		dayOfTheWeekNumber: dayOfTheWeekNumber,
		dayOfTheWeek: dayOfTheWeek,
		startTime: startTime,
		endTime: endTime,
		duration: e.hours,
		event_id: e._id,
		videoConferenceLink: e.videoConferenceLink
	}
	return newEvent;
};
