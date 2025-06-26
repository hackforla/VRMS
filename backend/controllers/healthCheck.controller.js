const HealthCheckController = {};

HealthCheckController.isAlive = (_, res) => {
  res
    .status(200)
    .send(`I'm Alive! Build: ${process.env.BUILD_SHA || 'unknown'} - ${new Date().toISOString()}`);
};

module.exports = HealthCheckController;
