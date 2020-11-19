const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const modificationLogSchema = mongoose.Schema({
    date: { type: Date },   
    authorEmail: { type: String },
    objectId: { type: String }, // modified object id stored as String
    objectType: {type: String, 
        enum : ['UserProfile', 'EventTemplate', 'ProjectInfo', 'ProjectMembership']},
    newState: { type: mongoose.Schema.Types.Mixed } 
    // modified object new state should be saved completely as an object
});

modificationLogSchema.index({ objectId: 1, objectType: 1 }, { unique: true });

modificationLogSchema.methods.serialize = function() {
    return {
        id: this._id,
        date: this.date,
        authorEmail: this.authorEmail,
        objectId: this.objectId,
        objectType: this.objectType,
        newState: this.newState
    };
};

const ModificationLog = mongoose.model('ModificationLog', modificationLogSchema);

module.exports = { ModificationLog };



