const { ModificationLogService } = require('./modificationLog.service');
const { UserProfileService } = require('./userProfile.service');
const { TimeZoneService } = require('./timeZone.service');
const { LocationService } = require('./location.service');
const { JobRoleService } = require('./jobRole.service');

module.exports = {
  ModificationLogService,
  UserProfileService,
  TimeZoneService,
  LocationService,
  JobRoleService
};
