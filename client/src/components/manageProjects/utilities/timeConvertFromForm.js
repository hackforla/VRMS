export const timeConvertFromForm = (dateObject, startTime) => {
	// This takes the time from the form and a 
	// Data object and adds the time to the object

   // reconstitute time from form to timestamp
	 const timeParts = startTime.split(':');
	 const sap = timeParts[1].slice(-2);
	 let startHour = parseInt(timeParts[0]);
	 const startMinutes = parseInt(timeParts[1].slice(0,-2));
	 const startSeconds = 0;
	 
	 // set 12am to 0 and make afternoon into military time
	 if (sap === 'pm' && startHour !== 12) {
		 startHour = startHour + 12;
	 } else if (sap === 'am' && startHour === 12) {
		 startHour = 0;
	 }

	// Update the date string with the start hours of the meeting
	 dateObject.setHours(startHour);
	 dateObject.setMinutes(startMinutes);
	 dateObject.setSeconds(startSeconds);	

	const newDate = new Date(dateObject.getTime());
	return newDate;
};
