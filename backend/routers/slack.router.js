const express = require("express");
const router = express.Router();
const { App } = require("@slack/bolt");
const cron = require("node-cron");
const Event = require("../models/event.model");
const Project = require("../models/project.model");
const User = require("../models/user.model");
const CheckIn = require("../models/checkIn.model");


//https://api.slack.com/web

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

//Checks DB every monday (1) for slack messages to schedule this week
// cron.schedule("* * * * 1", () => {});

// TODO: Refactor this server out of the router. This server instance is breaking the tests.
if (process.env.NODE_ENV !== "test") {
  (async () => {
    await app.start(3002);
    console.log("Connected to Slack");
  })();
}

//================ SLACKBOT FOR MEETING/EVENT REMINDERS ===============
//Finds Id number of channel
router.get("/findId", (req, res) => {
  publishMessage();
  findEvent();
  // findProject();
});

//uses Id number to send message to said channel
router.post("/postMeeting/:id", (req, res) => {
  publishMessage1();
});

async function findConversation(name) {
  try {
    const result = await app.client.conversations.list({
      token: process.env.SLACK_BOT_TOKEN,
    });

    for (var channel of result.channels) {
      if (channel.name === name) {
        conversationId = channel.id;

        console.log("Found conversation ID: " + conversationId);
        break;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function publishMessage(id, text) {
  try {
    const result = await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: process.env.SLACK_CHANNEL_ID,
      text: "Slack Message Publish",
    });

    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

async function publishMessage1(id, text) {
  try {
    const result = await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: id,
      text: text,
    });

    console.log(result);
    } catch (error) {
    console.error(error);
  }
}

async function findEvent(req, res) {
  Event.find({})
    .then((events) => {
      console.log("EVENTS", events);
      res.json(events);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json({
        message: `/GET Internal server error: ${err}`,
      });
    });
}

async function findProject(req, res) {
  Project.find({})
    .then((project) => {
      project.forEach((cur) => {
        console.log("PROJECT", cur.name);
      });
      res.json(project);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json({
        message: `/GET Internal server error: ${err}`,
      });
    });
}

//============= SLACKBOT FOR SENDING NEW USERS MESSAGES AND REMINDERS ==============

//----------------- FETCH LIST OF NEW USERS (LESS THAN 30 DAYS) --------------------
router.post("/msgNewUsers", (req, res) => {
  getUsers()
  //msgNewUsers();
});

//function to return list of users who are less than 30days new to HFLA
async function getUsers() {
  let newMembersList = [];
  await User.find({})
    .then(data => {
      return data;
    })
    .then(data => {
      data.forEach((cur) => {
        if(checkStartDate(cur.createdDate) < 30) {
          newMembersList.push(cur);
          //console.log(cur);
        }
      })
  })
  return newMembersList;
}

console.log(getUsers());


//function to check how long a user has been with the org (according to the date they created their VRMS account)
//let newUserList = [];
// function findNewUsers() {
//   let newUserList = [];
//   try {
//     let result = async () =>  {
//       User.find({})
//         .then((user) => {
//           user.forEach((cur) => {
//             let accountAge = checkStartDate(cur.createdDate);
//             //console.log(accountAge);
//             if (accountAge <= 30) {
//               newUserList.push(cur);
//             }
//           });
//         })
//     }
//     // console.log(newUserList)
//     //return newUserList;
//   }
//   catch(err) {
//     console.log(err);
//   }
//   console.log(newUserList)
//   return newUserList;
// }
// console.log(findNewUsers());

//function to check how long a user has been with the org (according to the date they created their VRMS account)
function checkStartDate(userCreatedDate) {
  let userStartDate = userCreatedDate;
  let userStartparsed = Date.parse(userStartDate);
  
  let dateNow = new Date();
  let diff = dateNow - userStartparsed;
  let diffDays = diff/1000/60/60/24;
  
  return diffDays;
}

function findAndDmChat(userEmailList) {
  try {
    const userSlackIds = Promise.all(userEmailList.map(async(userEmail) => {
      let result = await app.client.users.lookupByEmail({
        // The token you used to initialize your app
        token: process.env.SLACK_BOT_TOKEN,
        email: userEmail
      });
      let userSlackID = result.user.id;  
      
      //return result.user.id;
      
      let fileName = '../assets/1newMember.md';
      let textData = fs.readFileSync(fileName,'utf8');

      const sendUserMsgObj = app.client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: userSlackID,
        mrkdown: true,
        text: textData
      });      
    }))     
  }
  catch (error) {
    console.error(error);
  }
}


module.exports = router;