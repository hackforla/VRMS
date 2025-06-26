const { execSync } = require('child_process');
const fs = require('fs');

const HealthCheckController = {};

function getBuildInfo() {
  // Method 1: BUILD_SHA environment variable (from Docker build arg) - PRIORITY
  if (
    process.env.BUILD_SHA &&
    process.env.BUILD_SHA !== 'undefined' &&
    process.env.BUILD_SHA !== ''
  ) {
    return process.env.BUILD_SHA;
  }

  // Method 2: Check BUILD_INFO file (created during Docker build)
  try {
    if (fs.existsSync('/srv/backend/BUILD_INFO')) {
      const buildInfo = fs.readFileSync('/srv/backend/BUILD_INFO', 'utf8').trim();
      if (buildInfo && buildInfo !== 'unknown' && buildInfo !== '') {
        return buildInfo;
      }
    }
  } catch {
    // BUILD_INFO file not available
  }

  // Method 3: Try git command (for local development)
  try {
    const gitSha = execSync('git rev-parse --short HEAD 2>/dev/null', { encoding: 'utf8' }).trim();
    if (gitSha && gitSha !== '' && gitSha !== 'unknown') {
      return gitSha;
    }
  } catch {
    // Git not available
  }

  return 'unknown';
}

HealthCheckController.isAlive = (_, res) => {
  const buildInfo = getBuildInfo();
  res.status(200).send(`I'm Alive! Build: ${buildInfo} - ${new Date().toISOString()}`);
};

module.exports = HealthCheckController;
