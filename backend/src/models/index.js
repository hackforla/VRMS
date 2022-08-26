const { EventTemplate } = require('./eventTemplate.model');
const { ModificationLog } = require('./modificationLog.model');
const { ProjectInfo } = require('./projectInfo.model');
const { UserProfile } = require('./userProfile.model');
const { Project } = require('./project.model');

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

module.exports = {
  EventTemplate,
  ModificationLog,
  ProjectInfo,
  UserProfile,
  Project,
};
