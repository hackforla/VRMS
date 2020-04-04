module.exports = function (cron) {
    const task = cron.schedule('*/10 * * * * *', () => {
        console.log("I'm working here!");
    });

    return task;
};