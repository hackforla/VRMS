const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const timeTrackerSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  category: { type: String }, // picklist with 4 options: Development, Design/UX, Product/Project Management, Other
  notes: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
});

timeTrackerSchema.methods.serialize = function () {
  return {
    id: this._id,
    user: {
      userId: this.user.userId,
    },
    selectedAnswer: this.selectedAnswer,
    startDate: this.startDate,
    endDate: this.endDate,
  };
};

const TimeTracker = mongoose.model("TimeTracker", timeTrackerSchema);

module.exports = TimeTracker;
