export const findNextOccuranceOfDay = (dayOfTheWeek) => {
/***  
 This takes the number of the day of the week - with Sunday
 being day 0 - and returns a Data object with the next 
 occurance of that day
 ***/

 let day = parseInt(dayOfTheWeek);
 const date = new Date();
 date.setDate(date.getDate() + ((7 - date.getDay()) % 7 + day) % 7);

 return date;
}
