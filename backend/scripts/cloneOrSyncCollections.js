/**
 * Script to clone or sync collections from PROD to DEV MongoDB.
 *
 * Usage:
 *   node cloneOrSyncProjects.js [options]
 *
 * Options:
 *   --projects           Clone/sync the 'projects' collection
 *   --recurring-events   Clone/sync the 'recurringevents' collection
 *   --all                Clone/sync all supported collections
 *   --initial            Initial clone (insertMany, skip duplicates)
 *   --mock               Only print what would be written, do not write
 *   --help               Show this help message and exit
 *   (no flags)           Show help (safety mode)
 *
 * Requires environment variables:
 *   PROD_DB_URI - MongoDB URI for PROD
 *   DEV_DB_URI  - MongoDB URI for DEV
 *
 * Examples:
 *   node cloneOrSyncProjects.js --projects
 *   node cloneOrSyncProjects.js --recurring-events --initial
 *   node cloneOrSyncProjects.js --all --mock
 */

const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();

// Print help message for CLI usage
function printHelp() {
  console.log(
    `\nUsage: node cloneOrSyncProjects.js [options]\n\nOptions:\n  --projects           Clone/sync the 'projects' collection\n  --recurring-events   Clone/sync the 'recurringevents' collection\n  --all                Clone/sync all supported collections\n  --initial            Initial clone (insertMany, skip duplicates)\n  --mock               Only print what would be written, do not write\n  --help               Show this help message and exit\n\nExamples:\n  node cloneOrSyncProjects.js --projects\n  node cloneOrSyncProjects.js --recurring-events\n  node cloneOrSyncProjects.js --all --mock\n`,
  );
}

// ---- CONSTANTS ----
const COLLECTIONS = {
  projects: {
    name: 'projects',
    model: 'Project',
  },
  recurring_events: {
    name: 'recurringevents',
    model: 'RecurringEvent',
  },
};
const PROD_DB_NAME = 'db';
const DEV_DB_NAME = 'vrms-test';
// ---- CONSTANTS ----
// const COLLECTION_NAME = 'projects';
// const PROD_DB_NAME = 'vrms-test';
// const DEV_DB_NAME = 'vrms-test-sync';

/**
 * Throws if required environment variables are missing.
 */
function checkEnv() {
  if (!process.env.PROD_DB_URI || !process.env.DEV_DB_URI) {
    throw new Error('Both PROD_DB_URI and DEV_DB_URI environment variables must be set.');
  }
}

/**
 * Connects to both PROD (via Mongoose) and DEV (via MongoClient) MongoDB databases.
 * @returns {Promise<{prod: typeof mongoose, dev: MongoClient}>}
 */
async function connectDbs() {
  // Connect PROD using Mongoose
  await mongoose.connect(process.env.PROD_DB_URI, {
    dbName: PROD_DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // Connect DEV using MongoClient
  const dev = new MongoClient(process.env.DEV_DB_URI);
  await dev.connect();
  return { prod: mongoose, dev };
}

/**
 * Fetches all projects from the PROD database using the Project Mongoose model.
 * @returns {Promise<Array<Object>>}
 */

async function fetchProdCollection(collectionKey) {
  const { Project, RecurringEvent } = require('../models');
  let Model;
  if (collectionKey === 'projects') Model = Project;
  else if (collectionKey === 'recurring_events') Model = RecurringEvent;
  else throw new Error('Unknown collection: ' + collectionKey);
  const docs = await Model.find({});
  console.log(
    `[INFO] Fetched ${docs.length} ${COLLECTIONS[collectionKey].name} from PROD[${PROD_DB_NAME}].`,
  );
  return docs.map((doc) => doc.toObject());
}

/**
 * Performs the initial clone: insertMany, skip duplicates.
 * @param {MongoClient} devClient
 * @param {Array<Object>} projects
 * @returns {Promise<void>}
 */

async function initialClone(devClient, collectionKey, docs) {
  const devDb = devClient.db(DEV_DB_NAME);
  try {
    const result = await devDb
      .collection(COLLECTIONS[collectionKey].name)
      .insertMany(docs, { ordered: false });
    console.log(
      `[INFO] Inserted ${result.insertedCount} ${COLLECTIONS[collectionKey].name} into DEV[${DEV_DB_NAME}].`,
    );
  } catch (err) {
    if (err.code === 11000 || (err.writeErrors && err.writeErrors[0]?.code === 11000)) {
      // Duplicate key error: some docs inserted, some skipped
      const inserted = err.result?.result?.nInserted || err.result?.insertedCount || 0;
      console.log(
        `[WARN] Duplicate key error. Inserted ${inserted} new ${COLLECTIONS[collectionKey].name}, skipped duplicates.`,
      );
    } else {
      throw err;
    }
  }
}

/**
 * Syncs projects: upsert by _id using bulkWrite.
 * @param {MongoClient} devClient
 * @param {Array<Object>} projects
 * @returns {Promise<void>}
 */

async function syncCollection(devClient, collectionKey, docs) {
  const devDb = devClient.db(DEV_DB_NAME);
  const ops = docs.map((doc) => ({
    updateOne: {
      filter: { _id: doc._id },
      update: { $set: doc },
      upsert: true,
    },
  }));
  const result = await devDb
    .collection(COLLECTIONS[collectionKey].name)
    .bulkWrite(ops, { ordered: false });
  console.log(
    `[INFO] Upserted ${result.upsertedCount}, matched ${result.matchedCount}, modified ${result.modifiedCount} ${COLLECTIONS[collectionKey].name} in DEV.`,
  );
}

/**
 * Main coordinator function.
 */
async function main() {
  checkEnv();
  const isInitial = process.argv.includes('--initial');
  const isMock = process.argv.includes('--mock');
  const isHelp = process.argv.includes('--help');
  const doProjects = process.argv.includes('--projects');
  const doRecurring = process.argv.includes('--recurring-events');
  const doAll = process.argv.includes('--all');
  const noArgs = process.argv.length <= 2;
  if (isHelp || noArgs) {
    printHelp();
    return;
  }
  const collectionsToClone = [];
  if (doAll) {
    collectionsToClone.push('projects', 'recurring_events');
  } else {
    if (doProjects) collectionsToClone.push('projects');
    if (doRecurring) collectionsToClone.push('recurring_events');
  }
  if (collectionsToClone.length === 0) {
    printHelp();
    return;
  }

  let devClient;
  try {
    const dbs = await connectDbs();
    devClient = dbs.dev;
    for (const collectionKey of collectionsToClone) {
      const docs = await fetchProdCollection(collectionKey);
      if (isMock) {
        if (isInitial) {
          console.log(
            `[MOCK] Would insert ${docs.length} ${COLLECTIONS[collectionKey].name} into DEV[${DEV_DB_NAME}].`,
          );
        } else {
          console.log(
            `[MOCK] Would upsert ${docs.length} ${COLLECTIONS[collectionKey].name} into DEV[${DEV_DB_NAME}].`,
          );
        }
      } else {
        if (isInitial) {
          await initialClone(devClient, collectionKey, docs);
        } else {
          await syncCollection(devClient, collectionKey, docs);
        }
      }
    }
    if (!isMock) console.log('[SUCCESS] Operation completed.');
  } catch (err) {
    console.error('[ERROR]', err.message);
    process.exitCode = 1;
  } finally {
    // Close mongoose connection
    await mongoose.disconnect();
    if (devClient) await devClient.close();
  }
}

if (require.main === module) {
  main();
}
