const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.answer = require("./answer.model");
db.checkin = require("./checkIn.model");
db.event = require("./event.model");
db.project = require("./project.model");
db.projectTeamMember = require("./projectTeamMember.model");
db.question = require("./question.model");
db.recurringEvent = require("./recurringEvent.model");
db.role = require("./role.model");
db.user = require("./user.model");

module.exports = db;
