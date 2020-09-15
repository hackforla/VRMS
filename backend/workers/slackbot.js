module.exports = (fetch) => {
    console.log('Hello from SlackBot');
    const token = process.env.SLACK_TOKEN;

    let EVENTS;

    const fetchEvents = async () => {
        try {
            // const res = await fetch("https://vrms.io/api/events");
            const res = await fetch("http://localhost:4000/api/events");
            resJson = await res.json();

            const today = new Date();

            const todaysEvents = resJson.filter(event => {
                const eventDate = new Date(event.date);
                console.log('Event date: ', eventDate);
                const year = eventDate.getFullYear();
                const month = eventDate.getMonth();
                const date = eventDate.getDate();

                const yearToday = today.getFullYear();
                const monthToday = today.getMonth();
                const dateToday = today.getDate();

                console.log('Event: ', year, month, date);
                console.log('Today: ', yearToday, monthToday, dateToday);

                return (year === yearToday && month === monthToday && date === dateToday);
            })

            EVENTS = todaysEvents.filter(event => {
                const now = new Date();

                // 10 Minutes til event startTime
                // If event.date - 
                return (event.date )
            });

            console.log(EVENTS);
        } catch(error) {
            console.log(error);
        };

        const BASE_URL = 'https://slack.com/api/chat.postMessage'
        const channel = 'C013H2HN0VC';

        if (EVENTS && EVENTS.length > 0) {
            EVENTS.forEach(async event => {
                const team = event.project.name;
                const linkNew = 'http://localhost:3000/checkIn/newUser?eventId=' + event._id;
                const linkReturning = 'http://localhost:3000/checkIn/returningUser?eventId=' + event._id;
                const messageToSend = `&text=Hey ${team} team! Here are the links to check-in for your meeting tonight: \n\nNew User: ${linkNew} \nReturning User: ${linkReturning} \n\nHave fun tonight!`
                
                const urlToSend = `${BASE_URL}?token=${token}&channel=${channel}${messageToSend}&unfurl_media=false&username=VRMS Bot`;
                
                if (team.length > 0) {
                    console.log('Send slack message');
                    // await sendSlackMessage(urlToSend);
                } else {
                    console.log("Didn't do anything with " + (event && event));
                } 
            })
        }
    };

    async function sendSlackMessage(url) {
        console.log('Sending...');

        await fetch(url, {
            method: 'post'
        })
            .then(res => {
                const response = res.json();
                return response;
            })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
        
        console.log('Done sending');
    }

    setTimeout(async () => {
        // await fetchEvents();

    }, 5000);

    // return job;
}