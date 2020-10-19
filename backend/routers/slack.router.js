const express = require("express");
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
//function to return list of users who are less than 30days new to HFLA
async function findNewUsers(req, res) {
  let newUserList = [];
  User.find({})
    .then((user) => {
      user.forEach((cur) => {
        let accountAge = checkStartDate(cur.createdDate);
        if (accountAge <= 30) {
          newUserList.push(cur);
        }
      });
      //res.json(User);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json({
        message: `Error: ${err}`,
      });
    });
    return newUserList;
}
console.log(findNewUsers());

//function to check how long a user has been with the org (according to the date they created their VRMS account)
function checkStartDate(userCreatedDate) {
  let userStartDate = userCreatedDate;
  let userStartparsed = Date.parse(userStartDate);
  
  let dateNow = new Date();
  let diff = dateNow - userStartparsed;
  let diffDays = diff/1000/60/60/24;
  
  return diffDays;
}


// Check status of user - using their userId and looking through the checkIn model for their userId
async function userActivity(userList) {
  try {
    let newUsersList = findNewUsers()
    let toMessageList = [];
    
    return toMessageList;
  }
  catch (error) {
    console.error(error);
  }
}
//userActivity(); 


//------------MESSAGE USER FROM MARKDOWN BASED ON STATUS(ACTIVE/INACTIVE) -------------
//based on user ID, will send user a DM from the bot with a message
async function botDmChat() {
  try {
    
    //using conversations.open to find user's conversation object
    //TO DO: MAKE USER_ID DYNAMIC BASED ON DATABASE INFO/FUNCTION TO QUERY WHO TO MESSAGE
    const userConversations = await app.client.conversations.open({
      token: process.env.SLACK_BOT_TOKEN,
      users: process.env.USER_ID
    });
    
    //extracting user's DM id from conversation object
    let userDmId = userConversations.channel.id;
    
    //grabbing user's name from user object api
      let userObj = await app.client.users.info({
      token: process.env.SLACK_BOT_TOKEN,
      users: process.env.USER_ID
    });
    let userName = userObj.users[0].real_name;
    let fileName = ''
    let textData = fs.readFileSync(fileName,'utf8');

    //using user userDmId to send message to user
    const sendUserMsgObj = await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: userDmId,
      mrkdown: true,
      text: textData
    });
  }
  catch (error) {
    console.error(error);
  }
}


module.exports = router;