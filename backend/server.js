import mongoose from 'mongoose';

import app from './app.js';

import { Role } from './models/index.js';

// Load config variables
import { CONFIG_DB } from './config/index.js';

// Required convention for mongoose - https://stackoverflow.com/a/51862948/5900471
mongoose.Promise = global.Promise;

let server;
async function runServer(databaseUrl = CONFIG_DB.DATABASE_URL, port = CONFIG_DB.PORT) {
  await mongoose
    .connect(databaseUrl)
    .catch((err) => err);

  server = app
    .listen(port, () => {
      console.log(`Mongoose connected from runServer() and is listening on ${port}`);
    })
    .on('error', (err) => {
      mongoose.disconnect();
      return err;
    });
}

async function closeServer() {
  await mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing Mongoose connection. Bye');

      server.close((err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  });
}

async function initial() {
  try {
    const count = await Role.collection.estimatedDocumentCount();

    if (count === 0) {
      await new Role({
        name: "APP_USER",
      }).save();
      console.log("added 'user' to roles collection");

      await new Role({
        name: "APP_ADMIN",
      }).save();
      console.log("added 'moderator' to roles collection");
    }
  } catch (err) {
    console.log("error", err);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runServer()
    .then(() => initial())
    .catch((err) => console.error(err));
}

export { app, runServer, closeServer };
