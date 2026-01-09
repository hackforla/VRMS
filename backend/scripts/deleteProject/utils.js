/**
 * Utility functions for project deletion script
 */

const { ObjectId } = require('mongodb');
const { PROD_DB_NAME, DEV_DB_NAME, DEV_TEST_DB_NAME } = require('./config');

/**
 * Validate required environment variables
 */
function checkEnv() {
  if (!process.env.MIGRATION_DB_URI) {
    throw new Error('MIGRATION_DB_URI environment variable must be set.');
  }
}

/**
 * Validate if a string is a valid MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {boolean}
 */
function isValidObjectId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

/**
 * Extract project ID from command line arguments
 * @returns {string|null} Project ID or null if not found
 */
function getProjectIdFromArgs() {
  const projectIdArg = process.argv.find((arg) => arg.startsWith('--project-id='));
  if (!projectIdArg) return null;

  const projectId = projectIdArg.split('=')[1];
  if (!projectId || !isValidObjectId(projectId)) {
    throw new Error(`Invalid project ID: ${projectId}`);
  }

  return projectId;
}

/**
 * Print help message for CLI usage
 */
function printHelp() {
  console.log(
    `\nUsage: node deleteProjectAndAssociatedRecords.js --project-id=<PROJECT_ID> [options]\n\nOptions:\n  --project-id=<ID>  The MongoDB ObjectId of the project to delete (REQUIRED)\n  --prod             Operate on PRODUCTION database (${PROD_DB_NAME})\n  --live             Operate on development/staging database (${DEV_DB_NAME})\n  --test             Operate on test database (${DEV_TEST_DB_NAME})\n  --mock             Only print what would be deleted, do not delete (dry run)\n  --execute          Execute the deletion (actually delete from the database)\n  --help             Show this help message and exit\n\nExamples:\n  node deleteProjectAndAssociatedRecords.js --project-id=644748563212e6001fbca24a --test --mock\n  node deleteProjectAndAssociatedRecords.js --project-id=644748563212e6001fbca24a --test --execute\n  node deleteProjectAndAssociatedRecords.js --project-id=644748563212e6001fbca24a --live --execute\n  node deleteProjectAndAssociatedRecords.js --project-id=644748563212e6001fbca24a --prod --execute\n\nDocumentation:\n  See tmp/GUIDE.md for details\n`,
  );
}

module.exports = {
  checkEnv,
  isValidObjectId,
  getProjectIdFromArgs,
  printHelp,
};
