const EmailController = require('./email.controller');
const EventController = require('./event.controller');
const UserController = require('./user.controller');
const ProjectController = require('./project.controller');
const HealthCheckController = require('./healthCheck.controller');
const RecurringEventController = require('./recurringEvent.controller')
const FeatureFlagsController = require('./featureFlags.controller');

module.exports = {
  EmailController,
  EventController,
  UserController,
  ProjectController,
  HealthCheckController,
  RecurringEventController,
  FeatureFlagsController,
};
