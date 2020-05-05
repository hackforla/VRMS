const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

/*
Project Schema:
- id
- name
- description
- status (active/complete/paused)
- location
- createdDate
- completedDate
- githubUrl
Idea for the future: programmingLanguages, numberGithubContributions (pull these from github?)
*/

const projectSchema = mongoose.Schema({
    name: { type: String },
    description: { type: String },
    // owner: { type: String },
    projectStatus: { type: String },                // Active, Completed, or Paused
    location: { type: String },                     // DTLA, Westside, South LA, or Remote
    //teamMembers: { type: String },                // commented since we should be able to get this from Project Team Members table
    createdDate: { type: Date, default: Date.now }, // date/time project was created
    completedDate: { type: Date },                  // only if Status = Completed, date/time completed
    githubUrl: { type: String },                    // link to main repo
    slackUrl: { type: String },                     // link to Slack channel
    zoomMeetingLink: { type: String }               // should we move this to indvidual events?
});

projectSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        description: this.description,
        // owner: this.owner,
        projectStatus: this.projectStatus,
        location: this.location,
        //teamMembers: this.teamMembers,
        createdDate: this.createdDate,
        completedDate: this.completedDate,
        githubUrl: this.githubUrl,
        slackUrl: this.slackUrl,
        zoomMeetingLink: this.zoomMeetingLink
    };
};

const Project = mongoose.model('Project', projectSchema);

module.exports = { Project };