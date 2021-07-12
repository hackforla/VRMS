// test-setup.js
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
mongoose.promise = global.Promise;

const { MongoMemoryServer } = require("mongodb-memory-server");

async function removeAllCollections() {
  const mongooseCollections = mongoose.connection.collections;
  const collections = Object.keys(mongooseCollections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    collection.deleteMany();
  }
}

async function dropAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.drop();
    } catch (error) {
      // Sometimes this error happens, but you can safely ignore it
      if (error.message === "ns not found") return;
      // This error occurs when you use it.todo. You can
      // safely ignore this error too
      if (error.message.includes("a background operation is currently running"))
        return;
      console.log(error.message);
    }
  }
}
let mongoServer;
module.exports = {
  setupDB(databaseName) {
    // Connect to Mongoose
    beforeAll(async () => {
      mongoServer = new MongoMemoryServer({
        instance: { dbName: databaseName },
      });
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
    });

    // Cleans up database between each test
    afterEach(async () => {
      await removeAllCollections();
    });

    // Disconnect Mongoose
    afterAll(async () => {
      await dropAllCollections();
      await mongoose.connection.close();
      await mongoServer.stop();
    });
  },
};
