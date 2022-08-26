const { ProjectsService } = require('./projects.service');
const { LocationService } = require('./location.service');
const { ModificationLogService } = require('./modificationLog.service');
const { UserProfileService } = require('./userProfile.service');
const { TimeZoneService } = require('./timeZone.service');
const { JobRoleService } = require('./jobRole.service');

module.exports = {
  LocationService,
  ModificationLogService,
  UserProfileService,
  TimeZoneService,
  JobRoleService,
  ProjectsService,
};
