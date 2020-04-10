const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

/*
Project Schema:
- id
- name
- description
- owner
- status (active/complete/paused)
- location
- teamMembers (emails)
- createdDate
- completedDate
- githubUrl
Idea for the future: programmingLanguages, numberGithubContributions (pull these from github?)
*/

const projectSchema = mongoose.Schema({
    name: { type: String },
    description: { type: String },
    // owner: { type: String },
    projectStatus: { type: String },
    location: { type: String },
    teamMembers: { type: String },
    createdDate: { type: Date, default: Date.now },
    completedDate: { type: Date },
    githubUrl: { type: String },
    slackUrl: { type: String },
    zoomMeetingLink: { type: String }
});

projectSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        description: this.description,
        // owner: this.owner,
        projectStatus: this.projectStatus,
        location: this.location,
        teamMembers: this.teamMembers,
        createdDate: this.createdDate,
        completedDate: this.completedDate,
        githubUrl: this.githubUrl,
        slackUrl: this.slackUrl,
        zoomMeetingLink: this.zoomMeetingLink
    };
};

const Project = mongoose.model('Project', projectSchema);

module.exports = { Project };