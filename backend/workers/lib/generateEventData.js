function generateEventData(eventObj, TODAY_DATE = new Date()) {
    /**
     * Generates event data based on the provided event object and date.
     * In the cron job this function normally runs in, it is expected that eventObj.date is the same as TODAY_DATE.
     */
    const eventDate = new Date(eventObj.startTime);
    // Create new event
    const hours = eventDate.getHours();
    const minutes = eventDate.getMinutes();
    const seconds = eventDate.getSeconds();
    const milliseconds = eventDate.getMilliseconds();

    const yearToday = TODAY_DATE.getFullYear();
    const monthToday = TODAY_DATE.getMonth();
    const dateToday = TODAY_DATE.getDate();

    const newEventDate = new Date(yearToday, monthToday, dateToday, hours, minutes, seconds, milliseconds);

    const newEndTime = new Date(yearToday, monthToday, dateToday, hours + eventObj.hours, minutes, seconds, milliseconds)

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