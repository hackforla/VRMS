const express = require("express");
const router = express.Router();
const { App } = require("@slack/bolt");
const cron = require("node-cron");
const Event = require("../models/event.model");
const Project = require("../models/project.model");
const User = require("../models/user.model");
const CheckIn = require("../models/checkIn.model");
const fs = require('fs');


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

//FETCH LIST OF NEW USERS (LESS THAN 30 DAYS) 
async function getUsers() {
  //querying to find users that were created in the last 30 days
  const currentDate = new Date();
  const thirtyDaysPrior = new Date().setDate(currentDate.getDate() - 30);
  const thirtyDaysISO = new Date(thirtyDaysPrior).toISOString();
  
  const query = {createdDate: {$gte: thirtyDaysISO }}
  
  const users = await User.find(query);
  return users;
}

console.log("DM Chat:", findAndDmChat());

// MESSAGES LIST OF USERS WE GOT FROM getUsers() VIA SLACKBOT
async function findAndDmChat() {
  try {
    const potentialSlackUsers = await getUsers();
    const actualSlackUsers = [];

    //find users who are in our slack
    for (let user of potentialSlackUsers) {
      console.log("Email:", user.email)
      try {
        let result = await app.client.users.lookupByEmail({
          token: process.env.SLACK_BOT_TOKEN,
          email: user.email
        });
        let userSlackID = result.user.id;  
        actualSlackUsers.push(userSlackID);
        console.log("SlackID:", userSlackID);
      } 
      catch (err) {
        console.log("User is not on Slack");
      }
    }
 
    const fileName = './assets/newMember.md';
    const textData = fs.readFileSync(fileName,'utf8');
    
    //send Slack users msg from Slackbot
    for (let slackUser of actualSlackUsers) {
      const sendUserMsgObj = app.client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: slackUser,
        mrkdown: true,
        text: textData
      });      
      sendUserMsgObj();
    }  
  } catch(error) {
    console.log(error);
  }
}

module.exports = router;