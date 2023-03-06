export const addDurationToTime = (startTimeDate, duration) => { 
	
	let date = startTimeDate;
	let endTime;

	// Create the endTime by adding seconds to the timestamp and converting it back to date
	switch (duration) {
		case '.5':
			endTime = new Date(date.getTime() + (.5*3600000)); 
		break;
		case '1':
			endTime = new Date(date.getTime() + (1*3600000)); 
		break;
		case '1.5':
			endTime = new Date(date.getTime() + (1.5*3600000)); 
		break;
		case '2':
			endTime = new Date(date.getTime() + (2*3600000)); 
			break;
		case '2.5':
			endTime = new Date(date.getTime() + (2.5*3600000));
		break;
		case '3':
			endTime = new Date(date.getTime() + (3*3600000));
		break;
		case '3.5':
			endTime = new Date(date.getTime() + (3.5*3600000));
		break;
		case '4':
			endTime = new Date(date.getTime() + (4*3600000));
		break;
		default:
			throw new Error('Error: Cannot calculate endTime');
	} 
	return endTime;
};
