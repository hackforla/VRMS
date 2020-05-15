// module.exports = (fetch) => {
//     console.log('Hello from SlackBot');
//     const messageToSend = 'Testing!';

//     const url = 'https://hooks.slack.com/services/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';

//     async function sendSlackMessage(message, url) {
//         console.log('Sending...');

//         await fetch(url, {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: {
//                 text: message
//             }
//         })
//             .then(res => {
//                 console.log(res);
//             })
//             .catch(err => {
//                 console.log(err);
//             });

//         console.log('Done sending');
//     }
//     setTimeout(() => {
//         sendSlackMessage(messageToSend, url);

//     }, 5000);

//     // return job;
// }