/**
 * Configuration constants for project deletion script
 */

// Database names
const PROD_DB_NAME = 'db'; // Actual production database
const DEV_DB_NAME = 'vrms-test'; // Development/staging database
const DEV_TEST_DB_NAME = 'vrms-populate-projects-test'; // Test database for migration

module.exports = {
  PROD_DB_NAME,
  DEV_DB_NAME,
  DEV_TEST_DB_NAME,
};
