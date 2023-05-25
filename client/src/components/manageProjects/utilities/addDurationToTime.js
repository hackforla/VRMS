export const addDurationToTime = (startTimeDate, duration) => { 
	// Create the endTime by adding seconds based on the selected duration to the timestamp and converting it back to date
	if(startTimeDate && duration){
		return new Date(startTimeDate.getTime() + (Number(duration)*3600000))
	} else {
		throw new Error('Error: Cannot calculate endTime.')
	}
};