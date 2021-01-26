const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const locationSchema = mongoose.Schema({
    locations: [{ type: String }]
});

locationSchema.methods.serialize = function() {
    return {
        locations: this.locations
    };
};

const Location = mongoose.model('Project', locationSchema);

module.exports = { Location };
