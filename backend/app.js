
// app.js - Entry point for our application

// Load in all of our node modules. Their uses are explained below as they are called.
import express from 'express';
import morgan from 'morgan';
import cron from 'node-cron';
import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';

const customRequestHeaderName = 'x-customrequired-header';
const dontCheckCustomRequestHeaderApis = ['GET::/api/recurringevents', 'GET::/api/healthcheck'];

// Import environment variables
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const myEnv = dotenv.config();
dotenvExpand(myEnv);

// Verify environment variables
import assertEnv from 'assert-env';
assertEnv([
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
  'MAILHOG_PORT',
  'MAILHOG_USER',
  'MAILHOG_PASSWORD',
]);

// Create a new application using the Express framework
const app = express();

// Required to view Request Body (req.body) in JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Used to save JWT token from MagicLink
app.use(cookieParser());

// HTTP Request Logger
app.use(morgan('dev'));

// WORKERS
import openCheckins from './workers/openCheckins.js';
import closeCheckins from './workers/closeCheckins.js';
import createRecurringEvents from './workers/createRecurringEvents.js';
const runOpenCheckinWorker = openCheckins(cron, fetch);
const runCloseCheckinWorker = closeCheckins(cron, fetch);
const runCreateRecurringEventsWorker = createRecurringEvents(cron, fetch);
// import slackbot from './workers/slackbot.js';
// const runSlackBot = slackbot(fetch);

// Run cleanup expired refresh token(s) on startup
import { cleanupExpiredTokens } from './workers/tokenCleanup.js';
cleanupExpiredTokens();

// MIDDLEWARE
import errorhandler from './middleware/errorhandler.middleware.js';

// ROUTES
import eventsRouter from './routers/events.router.js';
import checkInsRouter from './routers/checkIns.router.js';
import usersRouter from './routers/users.router.js';
import questionsRouter from './routers/questions.router.js';
import checkUserRouter from './routers/checkUser.router.js';
import grantPermissionRouter from './routers/grantpermission.router.js';
import projectsRouter from './routers/projects.router.js';
import recurringEventsRouter from './routers/recurringEvents.router.js';
import projectTeamMembersRouter from './routers/projectTeamMembers.router.js';
//import slackRouter from './routers/slack.router.js';
import authRouter from './routers/auth.router.js';
import healthCheckRouter from './routers/healthCheck.router.js';

// Check that clients to the API are sending the custom request header on all methods
// except for ones described in the dontCheckCustomRequestHeaderApis array.
app.use(function customHeaderCheck(req, res, next) {
  let pathToCheck = req.path;

  if (pathToCheck.endsWith('/')) {
    pathToCheck = pathToCheck.substr(0, pathToCheck.length - 1);
  }

  const key = `${req.method}::${pathToCheck}`;

  if (dontCheckCustomRequestHeaderApis.includes(key)) {
    next();
  } else {
    const { headers } = req;
    const expectedHeader = process.env.CUSTOM_REQUEST_HEADER;

    if (headers[customRequestHeaderName] !== expectedHeader) {
      console.log("REQUEST SHOULD CONTAIN CUSTOM HEADER BUT IT ISN'T FOUND");
      res.sendStatus(401);
    } else {
      next();
    }
  }
});

app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/checkins', checkInsRouter);
app.use('/api/users', usersRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/checkuser', checkUserRouter);
app.use('/api/grantpermission', grantPermissionRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/recurringevents', recurringEventsRouter);
app.use('/api/projectteammembers', projectTeamMembersRouter);
//app.use('/api/slack', slackRouter);
app.use('/api/healthcheck', healthCheckRouter);

// 404 for all non-defined endpoints.
app.get('*', (req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use(errorhandler);

export default app;
