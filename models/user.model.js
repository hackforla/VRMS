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
    currentRole: { type: String },                  // will remove but need to update check-in form
    desiredRole: { type: String },                  // will remove but need to update check-in form
    newMember: { type: Boolean },
    currentJobTitle: { type: String },              // free-text of their current job title
    desiredJobTitle: { type: String },              // free-text of their desired job title
    skillsToMatch: [{ type: String }],              // skills the user either has or wants to learn - will use to match to projects
    firstAttended: { type: String },
    attendanceReason: { type: String },
    githubHandle: { type: String},                  // handle not including @, not the URL
    phone: { type: String },
    textingOk: { type: Boolean, default: false},     // is the user OK with texting at the phone number provided?
    slackName: { type: String } ,                    // does the user input this?
    isHflaGithubMember: { type: Boolean},            // pull from API once github handle in place?
    githubPublic2FA: { type: Boolean },              // does the user have 2FA enabled on their github and membership set to public? 
    availability: { type: String }                   // availability to meet outside of hacknight times; string for now, more structured in future
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
        currentRole: this.currentRole,              // will remove but need to update check-in form
        desiredRole: this.desiredRole,              // will remove but need to update check-in form
        newMember: this.newMember,
        currentJobTitle: this.currentRole,
        desiredJobTitle: this.desiredRole,
        skillsToMatch: this.skillsToMatch,
        firstAttended: this.firstAttended,
        attendanceReason: this.attendanceReason,
        githubHandle: this.githubHandle,
        phone: this.phone,
        textingOk: this.textingOk,
        slackName: this.slackName,
        isHflaGithubMember: this.isHflaGithubMember,
        githubPublic2FA: this.githubPublic2FA,
        availability: this.availability
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