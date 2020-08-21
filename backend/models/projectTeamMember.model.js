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
    vrmsProjectAdmin: { type: Boolean },            // does this team member have admin rights to the project in VRMS?
    roleOnProject: { type: String },                // Developer, Project Manager, UX, Data Science
    joinedDate: { type: Date, default: Date.now },  // date/time joined project
    leftDate: { type: Date },                       // only if Status = Inactive, date/time went inactive
    leftReason: { type: String },                   // project completed, project paused, switched projects, no-show, other
    githubPermissionLevel: { type: String },        // Write, Triage, Read, Maintainer, or Admin; pull from Github API?
    onProjectGithub: { type: Boolean, default: false },              // added to the project team on github? pull from github api?
    onProjectGoogleDrive: { type: Boolean, default: false}          // added to the project team's google drive folder?
});
projectTeamMemberSchema.methods.serialize = function() {
    return {
        id: this._id,
        userId: this.userId,
        projectId: this.projectId,
        teamMemberStatus: this.teamMemberStatus,
        vrmsProjectAdmin: this.vrmsProjectAdmin,
        roleOnProject: this.roleOnProject,
        joinedDate: this.joinedDate,
        leftDate: this.leftDate,
        leftReason: this.leftReason,
        githubPermissionLevel: this.githubPermissionLevel,
        onProjectGithub: this.onProjectGithub,
        onProjectGoogleDrive: this.onProjectGoogleDrive
    };
};

const ProjectTeamMember = mongoose.model('ProjectTeamMember', projectTeamMemberSchema);

module.exports = ProjectTeamMember;