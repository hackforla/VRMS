const supertest = require("supertest");
const { app, runServer } = require("../server");

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Default setting required for Jest to download MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer;
let backendServer;
let request;

beforeAll(async () => {
  try {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    const opts = {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    };

    mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    mongoose.connection.on("error", (err) => {
      console.log("err", err);
    });

    mongoose.connection.on("connected", (err, res) => {
      console.log("mongoose is connected");
    });

    backendServer = runServer(mongoUri);
    request = await supertest(backendServer);
  } catch (error) {
    console.log("-->error: ", error);
  }
});

async function dropAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.drop();
    } catch (error) {
      // This error happens when you try to drop a collection that's already dropped. Happens infrequently.
      // Safe to ignore.
      if (error.message === "ns not found") return;

      // This error happens when you use it.todo.
      // Safe to ignore.
      if (error.message.includes("a background operation is currently running"))
        return;

      console.log(error.message);
    }
  }
}

afterAll(async () => {
  await dropAllCollections();
  await mongoose.disconnect();
  await mongoServer.stop();
});

it("Gets the test endpoint", async (done) => {
  const res = await request.get("/api/events");
  console.log("-->res: ", res);
  done();
});
