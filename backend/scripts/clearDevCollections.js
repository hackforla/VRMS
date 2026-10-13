/**
 * Script to clear the 'projects' and/or 'recurringevents' collections from the DEV MongoDB database.
 *
 * Usage:
 *   node clearDevCollections.js [--projects] [--recurring-events]
 *
 * Arguments:
 *   --projects           Only clear the 'projects' collection
 *   --recurring-events   Only clear the 'recurringevents' collection
 *   --events              Only clear the 'events' collection
 *   --checkins            Only clear the 'checkins' collection
 *   --all                Clear all supported collections
 *   --mock               Only print what would be deleted, do not delete
 *   --help               Show this help message and exit
 *   (no flags)           Show help (safety mode)
 *
 * Requires environment variable:
 *   DEV_DB_URI  - MongoDB URI for DEV
 *
 * Example:
 *   node clearDevCollections.js --projects
 *   node clearDevCollections.js --recurring-events
 *   node clearDevCollections.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const DEV_DB_NAME = 'vrms-test'; // Match the DEV_DB_NAME from cloneOrSyncProjects.js
const COLLECTIONS = {
  projects: 'projects',
  recurring_events: 'recurringevents',
  events: 'events',
  checkins: 'checkins',
};

function printHelp() {
  console.log(
    `\nUsage: node clearDevCollections.js [options]\n\nOptions:\n  --projects           Only clear the 'projects' collection\n  --recurring-events   Only clear the 'recurringevents' collection\n  --events              Only clear the 'events' collection\n  --checkins            Only clear the 'checkins' collection\n  --all                Clear all supported collections\n  --mock               Only print what would be deleted, do not delete\n  --help               Show this help message and exit\n\nExamples:\n  node clearDevCollections.js --projects\n  node clearDevCollections.js --recurring-events\n  node clearDevCollections.js --all\n  node clearDevCollections.js --mock --all\n`,
  );
}

function checkEnv() {
  if (!process.env.DEV_DB_URI) {
    throw new Error('DEV_DB_URI environment variable must be set.');
  }
}

async function clearCollection(devClient, collectionName, isMock) {
  const devDb = devClient.db(DEV_DB_NAME);
  if (isMock) {
    const count = await devDb.collection(collectionName).countDocuments();
    console.log(
      `[MOCK] Would delete ${count} documents from ${collectionName} in DEV[${DEV_DB_NAME}].`,
    );
  } else {
    const result = await devDb.collection(collectionName).deleteMany({});
    console.log(
      `[INFO] Cleared ${result.deletedCount} documents from ${collectionName} in DEV[${DEV_DB_NAME}].`,
    );
  }
}

async function main() {
  checkEnv();
  const doProjects = process.argv.includes('--projects');
  const doRecurring = process.argv.includes('--recurring-events');
  const doEvent = process.argv.includes('--events');
  const doCheckIn = process.argv.includes('--checkins');
  const doAll = process.argv.includes('--all');
  const isMock = process.argv.includes('--mock');
  const isHelp = process.argv.includes('--help');
  const noArgs = process.argv.length <= 2;
  if (isHelp || noArgs) {
    printHelp();
    return;
  }
  const collectionsToClear = [];
  if (doAll) {
    collectionsToClear.push('projects', 'recurring_events', 'events', 'checkins');
  } else {
    if (doProjects) collectionsToClear.push('projects');
    if (doRecurring) collectionsToClear.push('recurring_events');
    if (doEvent) collectionsToClear.push('events');
    if (doCheckIn) collectionsToClear.push('checkins');
  }
  if (collectionsToClear.length === 0) {
    printHelp();
    return;
  }

  let devClient;
  try {
    devClient = new MongoClient(process.env.DEV_DB_URI);
    await devClient.connect();
    for (const key of collectionsToClear) {
      await clearCollection(devClient, COLLECTIONS[key], isMock);
    }
    if (!isMock) {
      console.log('[SUCCESS] Collections cleared.');
    }
  } catch (err) {
    console.error('[ERROR]', err.message);
    process.exitCode = 1;
  } finally {
    if (devClient) await devClient.close();
  }
}

if (require.main === module) {
  main();
}
