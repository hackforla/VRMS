// app.js - Entry point for our application

// Load in all of our node modules. Their uses are explained below as they are called.
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cookieParser = require("cookie-parser");

// Import environment variables
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const myEnv = dotenv.config();
dotenvExpand(myEnv);

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

// MIDDLEWARE
const errorhandler = require('./middleware/errorhandler.middleware');

// ROUTES
const employeesRouter = require('./employees');
const locationsRouter = require('./routers/locations.router');
const healthCheckRouter = require('./routers/healthCheck.router');

app.use('/api/employees', employeesRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/healthcheck', healthCheckRouter);

// 404 for all non-defined endpoints.
app.get("*", (req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use(errorhandler);

module.exports = app;
