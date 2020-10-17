const { Answer } = require('./answer.model');
const { CheckIn } = require('./checkIn.model');
const { Event } = require('./event.model');
const { Project } = require('./project.model');
const { ProjectTeamMember } = require('./projectTeamMember.model');
const { Question } = require('./question.model');
const { RecurringEvent } = require('./recurringEvent.model');
const { Role } = require('./role.model');
const { User } = require('./user.model');

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

module.exports = {
  Answer,
  CheckIn,
  Event,
  Project,
  ProjectTeamMember,
  Question,
  RecurringEvent,
  Role,
  User,
};
