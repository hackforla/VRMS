const app = require("./app");
const mongoose = require("mongoose");

// Load config variables
const { DATABASE_URL, PORT } = require("./config/database");

// Required convention for mongoose - https://stackoverflow.com/a/51862948/5900471
mongoose.Promise = global.Promise;

async function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  await mongoose
    .connect(databaseUrl, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .catch((err) => err);

  app
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
  runServer().catch((err) => console.error(err));
}

module.exports = { app, runServer, closeServer };
