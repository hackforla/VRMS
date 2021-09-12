const app = require("./src/app");
const mongoose = require("mongoose");

// Load config variables
const { CONFIG_DB } = require('./src/config/');

// Required convention for mongoose - https://stackoverflow.com/a/51862948/5900471
mongoose.Promise = global.Promise;

let server;
async function runServer(databaseUrl = CONFIG_DB.DATABASE_URL, port = CONFIG_DB.PORT) {
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
  runServer().catch((err) => console.error(err));
}

module.exports = { app, runServer, closeServer };
