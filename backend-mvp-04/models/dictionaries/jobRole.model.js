const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const jobRoleSchema = mongoose.Schema({
    roles: [{ type: String }]
});

jobRoleSchema.methods.serialize = function() {
    return {
        roles: this.roles
    };
};

const JobRole = mongoose.model('JobRole', jobRoleSchema);

module.exports = { JobRole };
