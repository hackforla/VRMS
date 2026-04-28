import mongoose from 'mongoose';
import { fileURLToPath } from 'url';

import app from './app.js';

import { Role } from './models/index.js';

// Load config variables
import { CONFIG_DB } from './config/index.js';

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

function initial() {
  Role.collection.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "APP_USER",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "APP_ADMIN",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runServer().catch((err) => console.error(err));
  initial();
}

export { app, runServer, closeServer };
