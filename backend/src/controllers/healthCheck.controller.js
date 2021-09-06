const HealthCheckController = {};

HealthCheckController.isAlive = (_, res) => {
  res.status(200).send("I'm Alive!");
}

module.exports = HealthCheckController;