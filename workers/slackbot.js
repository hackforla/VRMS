module.exports = (fetch) => {
    console.log('Hello from SlackBot');

    const BASE_URL = 'https://slack.com/api/chat.postMessage'
    const token = process.env.SLACK_TOKEN;
    const channel = 'C013H2HN0VC';
    const team = 'VRMS';
    const linkToCheckInFor = 'https://vrms.io';
    const messageToSend = '&text=' + 'Hey ' + team + " team! Here's the link to check-in for your meeting tonight: " + linkToCheckInFor + '. Have fun tonight!';
    const urlToSend = BASE_URL + '?' + 'token=' + token + '&channel=' + channel + messageToSend + '&unfurl_media=false&username=VRMS Bot';

    async function sendSlackMessage(url) {
        console.log('Sending...');

        await fetch(url, {
            method: 'post'
        })
            .then(res => {
                console.log(res.ok);
            })
            .catch(err => {
                console.log(err);
            });
        
        console.log('Done sending');
    }
    setTimeout(() => {
        sendSlackMessage(urlToSend);

    }, 5000);

    // return job;
}