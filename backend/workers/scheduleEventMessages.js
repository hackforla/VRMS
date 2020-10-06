module.exports = (cron, fetch) => {

    const URL = process.env.NODE_ENV === 'test' ? 'http://localhost:4000' : 'https://www.vrms.io';

    const checkAndScheduleMessages = cron.schedule('* * * * 1', () => {
        fetch(`${URL}/api/slack/scheduleMessages`);
    });

    return checkAndScheduleMessages;

}