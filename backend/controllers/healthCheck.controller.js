const { execSync } = require('child_process');

const HealthCheckController = {};

function getBuildInfo() {
  try {
    // Try to get git info from the container
    const gitSha = execSync('git rev-parse --short HEAD 2>/dev/null || echo "unknown"', {
      encoding: 'utf8',
    }).trim();
    return gitSha;
  } catch {
    return process.env.BUILD_SHA || 'unknown';
  }
}

HealthCheckController.isAlive = (_, res) => {
  const buildInfo = getBuildInfo();
  res.status(200).send(`I'm Alive! Build: ${buildInfo} - ${new Date().toISOString()}`);
};

module.exports = HealthCheckController;
