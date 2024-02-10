// grab the updatedDate
// get the timeZone offset
// if timeZone offset differs from the updatedDate to now
// normalize time to the updatedDate

function generateEventData(eventObj, TODAY_DATE = new Date()) {
    /**
     * Generates event data based on the provided event object and date.
     * In the cron job this function normally runs in, it is expected that eventObj.date is the same as TODAY_DATE.
     */
    
    const oldStartTime = new Date(eventObj.startTime);
    // Create new event
    const oldHours = oldStartTime.getHours();
    const oldMinutes = oldStartTime.getMinutes();
    const oldSeconds = oldStartTime.getSeconds();
    const oldMilliseconds = oldStartTime.getMilliseconds();

    const newYear = TODAY_DATE.getFullYear();
    const newMonth = TODAY_DATE.getMonth();
    const newDate = TODAY_DATE.getDate();
    
    const oldTz = oldStartTime.getTimezoneOffset();
    const newTz = TODAY_DATE.getTimezoneOffset();
    const tzDiff = oldTz - newTz;

    const newEventDate = new Date(newYear, newMonth, newDate, oldHours, oldMinutes, oldSeconds, oldMilliseconds);

    const newEndTime = new Date(newYear, newMonth, newDate, oldHours + eventObj.hours, oldMinutes, oldSeconds, oldMilliseconds)

    if (tzDiff != 0) {
        newEventDate.setMinutes(newEventDate.getMinutes() + tzDiff)
        newEndTime.setMinutes(newEndTime.getMinutes() + tzDiff)
    }

    const eventToCreate = {
        name: eventObj.name && eventObj.name,
        hacknight: eventObj.hacknight && eventObj.hacknight,
        eventType: eventObj.eventType && eventObj.eventType,
        description: eventObj.eventDescription && eventObj.eventDescription,
        project: eventObj.project && eventObj.project,
        date: eventObj.date && newEventDate,
        startTime: eventObj.startTime && newEventDate,
        endTime: eventObj.endTime && newEndTime,
        hours: eventObj.hours && eventObj.hours
    }
    
    if (eventObj.hasOwnProperty("location")) {
        eventToCreate.location = {
            city: eventObj.location.city ? eventObj.location.city : 'REMOTE',
            state: eventObj.location.state ? eventObj.location.state : 'REMOTE',
            country: eventObj.location.country ? eventObj.location.country : 'REMOTE'
        };
    }

    return eventToCreate
};

module.exports = { generateEventData };