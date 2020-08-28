/* tests/db-handler.js - The setup and teardown methods for the test instance of MongoDB.
This file should be imported and used in all backend unit, integration, and other tests.

The reason that the backend unit tests are in a single directory is largely to make
development easier to import this file. 
*/

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

mongoServer = new MongoMemoryServer();

/**
 * Connect to the in-memory database.
 */
module.exports.connect = async () => {
  const mongoUri = await mongoServer.getUri();
  const opts = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  };
  await mongoose.connect(mongoUri, opts, (err) => {
    if (err) console.error(err);
  });
};

/**
 * Drop database, close the connection and stop mongod.
 */
module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
