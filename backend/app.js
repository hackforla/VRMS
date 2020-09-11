// app.js - Entry point for our application

// Load in all of our node modules. Their uses are explained below as they are called.
const express = require("express");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const fetch = require("node-fetch");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");

require("dotenv").config();

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
const runOpenCheckinWorker = require("./workers/openCheckins")(cron, fetch);
const runCloseCheckinWorker = require("./workers/closeCheckins")(cron, fetch);
const runCreateRecurringEventsWorker = require("./workers/createRecurringEvents")(cron, fetch);
// const runSlackBot = require("./workers/slackbot")(fetch);

// ROUTES
const eventsRouter = require("./routers/events.router");
const checkInsRouter = require("./routers/checkIns.router");
const answersRouter = require("./routers/answers.router");
const usersRouter = require("./routers/users.router");
const questionsRouter = require("./routers/questions.router");
const checkUserRouter = require("./routers/checkUser.router");
const grantPermissionRouter = require("./routers/grantpermission.router");
const projectsRouter = require("./routers/projects.router");
const recurringEventsRouter = require("./routers/recurringEvents.router");
const projectTeamMembersRouter = require("./routers/projectTeamMembers.router");
const slackRouter = require("./routers/slack.router");
const authRouter = require("./routers/auth.router");

app.use("/api/events", eventsRouter);
app.use("/api/checkins", checkInsRouter);
app.use("/api/answers", answersRouter);
app.use("/api/users", usersRouter);
app.use("/api/questions", questionsRouter);
app.use("/api/checkuser", checkUserRouter);
app.use("/api/grantpermission", grantPermissionRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/recurringevents", recurringEventsRouter);
app.use("/api/projectteammembers", projectTeamMembersRouter);
app.use("/api/slack", slackRouter);
app.use("/api/auth", authRouter);
const CLIENT_BUILD_PATH = path.join(__dirname, "../client/build");

// Serve static files from the React frontend app
app.use(express.static(path.join(CLIENT_BUILD_PATH)));

// 404 for all non-defined endpoints.
app.get("*", (req, res) => {
  res.sendStatus(404);
});

module.exports = app;
