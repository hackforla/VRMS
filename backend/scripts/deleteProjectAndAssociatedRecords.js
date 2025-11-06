#!/usr/bin/env node

/**
 * Wrapper script for backwards compatibility.
 * The actual implementation has been moved to ./deleteProject/index.js
 *
 * This script simply delegates to the modular implementation.
 */

const { main } = require('./deleteProject/index');

if (require.main === module) {
  main();
}

module.exports = require('./deleteProject/index');
