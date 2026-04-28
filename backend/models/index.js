import { CheckIn } from './checkIn.model.js';
import { Event } from './event.model.js';
import { Project } from './project.model.js';
import { ProjectTeamMember } from './projectTeamMember.model.js';
import { Question } from './question.model.js';
import { RecurringEvent } from './recurringEvent.model.js';
import { Role } from './role.model.js';
import { User } from './user.model.js';
import { RefreshToken } from './refreshToken.model.js';

import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

module.exports = {
  CheckIn,
  Event,
  Project,
  ProjectTeamMember,
  Question,
  RecurringEvent,
  Role,
  User,
  RefreshToken,
};
