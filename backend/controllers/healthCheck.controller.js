import { execSync } from 'child_process';
import fs from 'fs';

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
    const gitSha = execSync('git rev-parse --short HEAD 2>/dev/null', { encoding: 'utf8', shell: true }).trim();
    if (gitSha && gitSha !== '' && gitSha !== 'unknown') {
      return gitSha;
    }
  } catch {
    // Git not available
  }

  return 'unknown';
}

// Cache build info at startup to avoid repeated file I/O and Git calls
const cachedBuildInfo = getBuildInfo();
const buildTimestamp = new Date().toISOString();

HealthCheckController.isAlive = (_, res) => {
  res
    .status(200)
    .send(
      `I'm Alive! Build: ${cachedBuildInfo} | Built: ${buildTimestamp} | Checked: ${new Date().toISOString()}`,
    );
};


export default HealthCheckController;
