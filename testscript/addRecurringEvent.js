const fetch = require("node-fetch");

// fetch("http://localhost:4000/api/recurringevents/")
//     .then(res => res.json())
//     .then(data => console.log(data))
//     .catch(err => console.log(err));


const startTime = new Date();
startTime.setHours(23);
startTime.setMinutes(55);
startTime.setMilliseconds(0);
console.log(startTime.setDate(20));
console.log(startTime.getDay());
console.log(startTime);