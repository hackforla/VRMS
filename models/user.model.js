const mongoose = require('mongoose');
// const bcrypt = require('bcrypt-nodejs');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
    name: {
        firstName: { type: String },
        lastName: { type: String }
    },
    email: { type: String, unique: true },
    accessLevel: { type: String, default: "user" },
    createdDate: { type: Date, default: Date.now },
    currentRole: { type: String },
    desiredRole: { type: String },
    newMember: { type: Boolean },
    firstAttended: { type: String },
    attendanceReason: { type: String },
    githubHandle: { type: String}
    //currentProject: { type: String }              // no longer need this as we can get it from Project Team Member table
    // password: { type: String, required: true }
});

userSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: {
            firstName: this.name.firstName,
            lastName: this.name.lastName
        },
        email: this.email,
        accessLevel: this.accessLevel,
        createdDate: this.createdDate,
        currentRole: this.currentRole,
        desiredRole: this.desiredRole,
        newMember: this.newMember,
        firstAttended: this.firstAttended,
        attendanceReason: this.attendanceReason,
        githubHandle: this.githubHandle
        //currentProject: this.currentProject
    };
};



// userSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// userSchema.methods.validatePassword = function(password) {
//     return bcrypt.compareSync(password, this.password);
// };

const User = mongoose.model('User', userSchema);

module.exports = { User };