const { CheckIn } = require('./checkIn.model');
const { Event } = require('./event.model');
const { Project } = require('./project.model');
const { ProjectTeamMember } = require('./projectTeamMember.model');
const { Question } = require('./question.model');
const { RecurringEvent } = require('./recurringEvent.model');
const { User } = require('./user.model');

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

module.exports = {
  CheckIn,
  Event,
  Project,
  ProjectTeamMember,
  Question,
  RecurringEvent,
  User,
};
