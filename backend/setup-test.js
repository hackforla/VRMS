// test-setup.js
import mongoose from 'mongoose';
mongoose.promise = global.Promise;

import { MongoMemoryServer } from 'mongodb-memory-server';

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
      if (error.message === "ns not found") return;
      if (error.message.includes("a background operation is currently running"))
        return;
      console.log(error.message);
    }
  }
}

let mongoServer;
export const setupIntegrationDB = (databaseName) => {
    // Connect to Mongoose
    beforeAll(async () => {
      mongoServer = await MongoMemoryServer.create({
        instance: { dbName: databaseName },
      });
      const mongoUri = mongoServer.getUri();
      try {
        await mongoose.connect(mongoUri);
      } catch (err) {
        console.error(err);
      }
    });

    // Disconnect Mongoose
    afterAll(async () => {
      await dropAllCollections();
      await mongoose.connection.close();
      await mongoServer.stop();
    });
};

export const setupDB = setupIntegrationDB;
