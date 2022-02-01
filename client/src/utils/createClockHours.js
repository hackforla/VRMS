export function createClockHours () {

	let hours = [12];
	let clockHours = [];
    
	for (let i = 1; i < 12; i++) {
	  hours.push(i);
	}
    
	let aorp = 'am';
	for (let i = 0; i < 2; i++) {
	  for (const d of hours) {
	      clockHours.push(d + ':00' + aorp);
	      clockHours.push(d + ':30' + aorp);
	  }
	  aorp = "pm"; 
	}
	return clockHours;
      }