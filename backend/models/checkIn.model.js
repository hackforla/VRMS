const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const checkInSchema = mongoose.Schema({
  userId: { type: String, require },
  eventId: { type: String, require },
  checkedIn: { type: Boolean, default: true },
  createdDate: { type: Date, default: Date.now },
});

checkInSchema.methods.serialize = function () {
  return {
    id: this._id,
    userId: this.userId,
    eventId: this.eventId,
    checkedIn: this.checkedIn,
    createdDate: this.createdDate,
  };
};

const CheckIn = mongoose.model("CheckIn", checkInSchema);

module.exports = { CheckIn };
