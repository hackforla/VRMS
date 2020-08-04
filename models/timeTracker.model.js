const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const timeTrackerSchema = mongoose.Schema({
    hours: { type: Number },                // limit to whole numbers or .5 ?
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    category: { type: String },             // picklist with 4 options: Development, Design/UX, Product/Project Management, Other
    notes: { type: String },
    createdDate: { type: Date, default: Date.now }
});

timeTrackerSchema.methods.serialize = function() {
    return {
        id: this._id,
        hours: this.hours,
        user: {
            userId: this.user.userId
        },
        selectedAnswer: this.selectedAnswer,
        createdDate: this.createdDate
    };
};

const TimeTracker = mongoose.model('TimeTracker', timeTrackerSchema);

module.exports = { timeTracked };