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
    userId: { type: String },                       // id of the user
    projectId: { type: String },                    // id of the project
    teamMemberStatus: { type: String },             // Active or Inactive
    roleOnProject: { type: String },                // Developer, Project Manager, UX, Data Science
    joinedDate: { type: Date, default: Date.now },  // date/time joined project
    leftDate: { type: Date },                       // only if Status = Inactive, date/time went inactive
    leftReason: { type: String },                   // project completed, project paused, switched projects, no-show, other
});

projectTeamMemberSchema.methods.serialize = function() {
    return {
        id: this._id,
        userId: this.userId,
        projectId: this.projectId,
        teamMemberStatus: this.teamMemberStatus,
        roleOnProject: this.roleOnProject,
        joinedDate: this.joinedDate,
        leftDate: this.leftDate,
        leftReason: this.leftReason
    };
};

const ProjectTeamMember = mongoose.model('ProjectTeamMember', projectTeamMemberSchema);

module.exports = { ProjectTeamMember };