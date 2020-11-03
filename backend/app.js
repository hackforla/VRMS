// app.js - Entry point for our application

// Load in all of our node modules. Their uses are explained below as they are called.
const express = require("express");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const fetch = require("node-fetch");
const morgan = require('morgan');
const cookieParser = require("cookie-parser");

const customRequestHeaderName = 'x-customrequired-header';
const dontCheckCustomRequestHeaderApis = ["GET::/api/recurringevents"];

// Import environment variables
require("dotenv").config();

// Verify environment variables
require('assert-env')([
  'CUSTOM_REQUEST_HEADER',
  'SLACK_OAUTH_TOKEN',
  'SLACK_BOT_TOKEN',
  'SLACK_TEAM_ID',
  'SLACK_CHANNEL_ID',
  'SLACK_CLIENT_ID',
  'SLACK_CLIENT_SECRET',
  'SLACK_SIGNING_SECRET',
  'BACKEND_PORT',
  'REACT_APP_PROXY',
  'GMAIL_CLIENT_ID',
  'GMAIL_SECRET_ID',
  'GMAIL_REFRESH_TOKEN',
  'GMAIL_EMAIL',
]);
 

// Create a new application using the Express framework
const app = express();

// Required to view Request Body (req.body) in JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Used to save JWT token from MagicLink
app.use(cookieParser());

// HTTP Request Logger
app.use(morgan("dev"));

// Hide sensitive Header data
// app.use(helmet());

// Cross-Origin-Resource-Sharing
// app.use(cors());

// WORKERS
const runOpenCheckinWorker = require('./workers/openCheckins')(cron, fetch);
const runCloseCheckinWorker = require('./workers/closeCheckins')(cron, fetch);
const runCreateRecurringEventsWorker = require('./workers/createRecurringEvents')(cron, fetch);
// const runSlackBot = require("./workers/slackbot")(fetch);

// ROUTES
const eventsRouter = require("./routers/events.router");
const checkInsRouter = require('./routers/checkIns.router');
const usersRouter = require("./routers/users.router");
const questionsRouter = require("./routers/questions.router");
const checkUserRouter = require("./routers/checkUser.router");
const grantPermissionRouter = require("./routers/grantpermission.router");
const projectsRouter = require("./routers/projects.router");
const recurringEventsRouter = require("./routers/recurringEvents.router");
const projectTeamMembersRouter = require("./routers/projectTeamMembers.router");
const slackRouter = require("./routers/slack.router");
const authRouter = require("./routers/auth.router");

// Check that clients to the API are sending the custom request header on all methods
// except for ones described in the dontCheckCustomRequestHeaderApis array
app.use(function customHeaderCheck (req, res, next) {

  // console.log(`Path: ${  req.path  } Method: ${  req.method}`);

  let pathToCheck = req.path;

  if(pathToCheck.endsWith("/")){
    pathToCheck = pathToCheck.substr(0, pathToCheck.length-1);
  }

  const key = `${req.method}::${pathToCheck}`;
  // console.log(`key: ${  key  }`);
  if(!dontCheckCustomRequestHeaderApis.includes(key)) 
  {
    // console.log(`CUSTOM HEADER CHECKING FOR KEY: ${key}`);
    const { headers } = req;
    const expectedHeader = process.env.CUSTOM_REQUEST_HEADER;

    if (headers[customRequestHeaderName] !== expectedHeader) {
      // console.log("CUSTOM HEADER NOT FOUND");
      res.sendStatus(401);
    } else {
      // console.log("CUSTOM HEADER WAS FOUND");
      next();
    }
  }
  
})

app.use('/api/auth', authRouter);
app.use("/api/events", eventsRouter);
app.use('/api/checkins', checkInsRouter);
app.use("/api/users", usersRouter);
app.use("/api/questions", questionsRouter);
app.use("/api/checkuser", checkUserRouter);
app.use("/api/grantpermission", grantPermissionRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/recurringevents", recurringEventsRouter);
app.use("/api/projectteammembers", projectTeamMembersRouter);
app.use('/api/slack', slackRouter);

// 404 for all non-defined endpoints.
app.get("*", (req, res) => {
  res.sendStatus(404);
});

module.exports = app;
