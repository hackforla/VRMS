#!/usr/bin/env node

/**
 * Script to delete a project and all associated records from the database.
 *
 * This script performs a cascading deletion of:
 * - Check-ins associated with project events
 * - Project team members
 * - Project references from users (projects and managedProjects arrays)
 * - Events associated with the project
 * - Recurring events associated with the project
 * - The project itself
 *
 * Usage:
 *   node index.js --project-id=<PROJECT_ID> [options]
 *
 * Options:
 *   --project-id=<ID>    The MongoDB ObjectId of the project to delete (REQUIRED)
 *   --prod               Operate on production database (db)
 *   --live               Operate on development/staging database (vrms-test)
 *   --test               Operate on test database (vrms-populate-projects-test)
 *   --mock               Only print what would be deleted, do not delete (dry run)
 *   --execute            Execute the deletion (actually delete from the database)
 *   --help               Show this help message and exit
 *   (no flags)           Show help (safety mode)
 *
 * Requires environment variable:
 *   MIGRATION_DB_URI  - MongoDB connection string for migration
 *
 * Examples:
 *   node index.js --project-id=644748563212e6001fbca24a --test --mock
 *   node index.js --project-id=644748563212e6001fbca24a --test --execute
 *   node index.js --project-id=644748563212e6001fbca24a --live --execute
 *   node index.js --project-id=644748563212e6001fbca24a --prod --execute
 *
 * See documentation: tmp/GUIDE.md
 */

const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Import modules
const { PROD_DB_NAME, DEV_DB_NAME, DEV_TEST_DB_NAME } = require('./config');
const { checkEnv, getProjectIdFromArgs, printHelp } = require('./utils');
const {
  findProject,
  findProjectEvents,
  findEventCheckIns,
  findProjectTeamMembers,
  findUsersReferencingProject,
  findRelatedRecurringEvents,
} = require('./finders');
const {
  displayUserDetails,
  displayEventDetails,
  displayCheckInDetails,
  displayProjectTeamMemberDetails,
  displayRecurringEventDetails,
} = require('./displays');
const {
  deleteCheckIns,
  deleteProjectTeamMembers,
  updateUsersRemoveProject,
  deleteEvents,
  deleteRecurringEvents,
  deleteProject,
} = require('./deleters');

/**
 * Main coordinator function
 */
async function main() {
  const isProd = process.argv.includes('--prod');
  const isLive = process.argv.includes('--live');
  const isTest = process.argv.includes('--test');
  const isMock = process.argv.includes('--mock');
  const isExecute = process.argv.includes('--execute');
  const isHelp = process.argv.includes('--help');
  const noArgs = process.argv.length <= 2;

  if (isHelp || noArgs) {
    printHelp();
    return;
  }

  // Check environment only after help check
  checkEnv();

  // Get project ID
  let projectId;
  try {
    projectId = getProjectIdFromArgs();
    if (!projectId) {
      console.error('[ERROR] --project-id is required.');
      printHelp();
      process.exitCode = 1;
      return;
    }
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
    printHelp();
    process.exitCode = 1;
    return;
  }

  // Check that only one database flag is specified
  const dbFlags = [isProd, isLive, isTest].filter(Boolean);
  if (dbFlags.length > 1) {
    console.error(
      '[ERROR] Cannot specify multiple database flags. Choose one: --prod, --live, or --test.',
    );
    process.exitCode = 1;
    return;
  }

  if (dbFlags.length === 0) {
    console.error('[ERROR] Must specify a database: --prod, --live, or --test.');
    printHelp();
    process.exitCode = 1;
    return;
  }

  if (isMock && isExecute) {
    console.error('[ERROR] Cannot specify both --mock and --execute. Choose one.');
    process.exitCode = 1;
    return;
  }

  if (!isMock && !isExecute) {
    console.error('[ERROR] Must specify either --mock (dry run) or --execute (actual deletion).');
    printHelp();
    process.exitCode = 1;
    return;
  }

  // Determine database name and mode label
  let dbName, modeLabel;
  if (isProd) {
    dbName = PROD_DB_NAME;
    modeLabel = 'PRODUCTION';
  } else if (isLive) {
    dbName = DEV_DB_NAME;
    modeLabel = 'DEVELOPMENT/STAGING';
  } else {
    dbName = DEV_TEST_DB_NAME;
    modeLabel = 'TEST';
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`DELETE PROJECT AND ASSOCIATED RECORDS`);
  console.log(
    `Mode: ${modeLabel} ${
      isMock ? '(DRY RUN - No changes will be made)' : '(EXECUTE - Will DELETE from database)'
    }`,
  );
  console.log(`Database: ${dbName}`);
  console.log(`Project ID: ${projectId}`);
  console.log(`${'='.repeat(60)}\n`);

  if ((isProd || isLive) && isExecute) {
    console.log(
      `[WARNING] Operating on ${modeLabel} database with EXECUTE mode. This will DELETE data!`,
    );
    console.log(`[WARNING] Press Ctrl+C within 5 seconds to cancel...`);
    await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 seconds for prod/live
  }

  let client;
  try {
    // Connect to MongoDB
    client = new MongoClient(process.env.MIGRATION_DB_URI);
    await client.connect();
    console.log('[INFO] Connected to MongoDB.\n');

    const db = client.db(dbName);

    // Step 0: Verify project exists
    const project = await findProject(db, projectId);
    if (!project) {
      console.log('[ERROR] Cannot proceed without a valid project.');
      process.exitCode = 1;
      return;
    }

    console.log('\n--- GATHERING RECORDS TO DELETE ---\n');

    // Step 1: Find all events for this project
    const events = await findProjectEvents(db, projectId);

    // Step 2: Find all check-ins for those events
    const checkIns = await findEventCheckIns(db, events);

    // Step 3: Find all project team members
    const teamMembers = await findProjectTeamMembers(db, projectId);

    // Step 4: Find all users referencing this project
    const users = await findUsersReferencingProject(db, projectId);

    // Step 5: Check for recurring events
    const recurringEvents = await findRelatedRecurringEvents(db, events);
    if (recurringEvents.length > 0) {
      console.log(
        `[INFO] Found ${recurringEvents.length} recurring event(s) associated with this project.`,
      );
    }

    console.log('\n--- DELETION PLAN SUMMARY ---\n');
    console.log(`  Check-ins to delete: ${checkIns.length}`);
    console.log(`  Project team members to delete: ${teamMembers.length}`);
    console.log(`  Users to update: ${users.length}`);
    console.log(`  Events to delete: ${events.length}`);
    console.log(`  Recurring events to delete: ${recurringEvents.length}`);
    console.log(`  Projects to delete: 1`);
    console.log('');

    // Display detailed information about all records
    displayUserDetails(users, projectId);
    displayProjectTeamMemberDetails(teamMembers);
    displayEventDetails(events);
    await displayCheckInDetails(checkIns, events, db);
    displayRecurringEventDetails(recurringEvents);

    if (isMock) {
      console.log('[MOCK] This is a dry run. No changes will be made.\n');
    } else {
      console.log('[EXECUTE] Beginning deletion process...\n');
    }

    console.log('--- EXECUTING DELETIONS (in order) ---\n');

    // Step 6: Delete check-ins
    await deleteCheckIns(db, checkIns, isMock);

    // Step 7: Delete project team members
    await deleteProjectTeamMembers(db, projectId, isMock);

    // Step 8: Update users to remove project references
    await updateUsersRemoveProject(db, projectId, users, isMock);

    // Step 9: Delete events
    await deleteEvents(db, projectId, isMock);

    // Step 10: Delete recurring events
    await deleteRecurringEvents(db, recurringEvents, isMock);

    // Step 11: Delete the project
    await deleteProject(db, projectId, isMock);

    console.log(`\n${'='.repeat(60)}`);
    if (isMock) {
      console.log('[MOCK] Dry run completed. No changes were made.');
    } else {
      console.log('[SUCCESS] Project and all associated records deleted successfully.');
    }
    console.log(`${'='.repeat(60)}\n`);
  } catch (err) {
    console.error('[ERROR]', err.message);
    console.error(err.stack);
    process.exitCode = 1;
  } finally {
    if (client) {
      await client.close();
      console.log('[INFO] Database connection closed.');
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
