// server.js - Entry point for our application

// Load in all of our node modules. Their uses are explained below as they are called.
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
// const helmet = require('helmet');
// const cors = require('cors');
const path = require("path");
const cron = require("node-cron");
const fetch = require("node-fetch");

// Create a new application using the Express framework
const app = express();

// Load config variables
const { DATABASE_URL, PORT } = require("./config/database");

// Required to view Request Body (req.body) in JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// HTTP Request Logger
app.use(morgan("dev"));

// Hide sensitive Header data
// app.use(helmet());

// Cross-Origin-Resource-Sharing
// app.use(cors());

// Let mongoose access Promises
mongoose.Promise = global.Promise;

// WORKERS
const runOpenCheckinWorker = require("./workers/openCheckins")(cron, fetch);
const runCloseCheckinWorker = require("./workers/closeCheckins")(cron, fetch);
const runCreateRecurringEventsWorker = require("./workers/createRecurringEvents")(cron, fetch);
// const bot = require("./workers/slackbot")(fetch);

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

app.use("/api/events", eventsRouter);
app.use("/api/checkins", checkInsRouter);
app.use("/api/answers", answersRouter);
app.use("/api/users", usersRouter);
app.use("/api/questions", questionsRouter);
app.use("/api/checkuser", checkUserRouter);
app.use("/api/grantpermission", grantPermissionRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/recurringevents", recurringEventsRouter);

const CLIENT_BUILD_PATH = path.join(__dirname, "./client/build");

// Serve static files from the React frontend app
app.use(express.static(path.join(CLIENT_BUILD_PATH)));

// Anything that doesn't match the above, send back index.html
app.get("*", (req, res) => {
  const index = path.join(CLIENT_BUILD_PATH, "index.html");

  res.sendFile(index);
});

// Make the server functions available to testing
let server;

async function runServer(databaseUrl, port = PORT) {
  await mongoose
    .connect(databaseUrl, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .catch((err) => err);

  server = app
    .listen(port, () => {
      console.log(
        `Mongoose connected from runServer() and is listening on ${port}`
      );
    })
    .on("error", (err) => {
      mongoose.disconnect();
      return err;
    });
}

async function closeServer() {
  await mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing Mongoose connection. Bye");

      server.close((err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch((err) => console.error(err));
}

// app.listen(process.env.PORT || PORT, () => {
//     console.log(`Server is listening on port: ${process.env.PORT || PORT}`);
// });

module.exports = { app, runServer, closeServer };
