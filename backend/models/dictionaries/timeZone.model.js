const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const timeZoneSchema = mongoose.Schema({
    timeZones: [{ type: String }]
});

timeZoneSchema.methods.serialize = function() {
    return {
        timeZones: this.timeZones
    };
};

const TimeZone = mongoose.model('TimeZone', timeZoneSchema);

module.exports = { TimeZone };
