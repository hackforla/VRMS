module.exports = (cron, fetch) => {
    // const URL = process.env.NODE_ENV === 'prod' ? 'https://www.vrms.io' : 'http://localhost:4000';
    const URL = 'https://www.vrms.io'
    const checkAndScheduleMessages = cron.schedule('* * * * 1', () => {
        fetch(`${URL}/api/slack/scheduleMessages`);

    });
    return checkAndScheduleMessages;

}