const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

/*
ProjectTeamMember:
- projectID
- user ID
- teamMemberStatus (active/inactive)
- roleOnProject
- joinedDate
- leftDate
- leftReason (project completed, project paused, switched projects, no-show, etc.)
Idea for the future: numberGithubContributions (pull this from github?)
*/

const projectTeamMemberSchema = mongoose.Schema({
    user: { type: String },
    teamMemberStatus: { type: String },
    roleOnProject: { type: String },
    joinedDate: { type: Date, default: Date.now },
    leftDate: { type: Date },
    leftReason: { type: String },
});

projectTeamMemberSchema.methods.serialize = function() {
    return {
        id: this._id,
        user: this.user,
        teamMemberStatus: this.teamMemberStatus,
        roleOnProject: this.roleOnProject,
        joinedDate: this.joinedDate,
        leftDate: this.leftDate,
        leftReason: this.leftReason
    };
};

const ProjectTeamMember = mongoose.model('ProjectTeamMember', projectTeamMemberSchema);

module.exports = { ProjectTeamMember };