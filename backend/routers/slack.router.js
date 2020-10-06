const express = require("express");
const router = express.Router();
const { App } = require("@slack/bolt");
const cron = require("node-cron");
const Event = require("../models/event.model");
const Project = require("../models/project.model");

//https://api.slack.com/web

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// TODO: Refactor this server out of the router. This server instance is breaking the tests.
if (process.env.NODE_ENV !== "test") {
  (async () => {
    await app.start(3002);
    console.log("Connected to Slack");
  })();
}

//Finds Id number of channel
router.post("/scheduleMessages",
  findEvent,
  scheduleMeetings
);

async function scheduleMeetings(req, res, next) {
  res.locals.events.forEach((cur) => {
    scheduleMeeting(cur)
  })

}

async function findEvent(req, res, next) {
  let currentDate = new Date
  Event.find({ date: { $gt: currentDate } })
    .populate("project")
    .then((events) => {
      console.log('EVENTS', events)
      res.locals.events = events
      next()
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500).json({
        message: `/GET Internal server error: ${err}`,
      });
    });
}

async function scheduleMeeting(cur) {
  try {
    let eventName = cur.name
    let eventChannel = cur.project.slackUrl
    let projectName = cur.project.name
    let scheduledPostTime = cur.startTime - 1800000
    scheduledPostTime = new Date(scheduledPostTime)
    eventChannel = eventChannel.split('/')
    eventChannel = eventChannel[4]

    const result = await app.client.chat.scheduleMessage({
      token: process.env.SLACK_OAUTH_TOKEN,
      channel: eventChannel,
      text: `Hello ${projectName} members! The ${eventName} will be starting in 30 minutes!`,
      post_at: scheduledPostTime

    });

  } catch (error) {
    console.error(error);
  }
}

module.exports = router;
