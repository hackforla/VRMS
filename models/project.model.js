const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

/*
Project Schema:
- id
- name
- description
- owner
- status (active/complete/paused)
- hackNights (DTLA, Westside, South)
- teamMembers (emails)
- createdDate
- completedDate
- githubUrl
Idea for the future: programmingLanguages, numberGithubContributions (pull these from github?)
*/

const projectSchema = mongoose.Schema({
    name: { type: String },
    description: { type: String },
    owner: { type: String },
    projectStatus: { type: String },
    hackNights: {
        dtla: { type: Boolean },
        westside: { type: Boolean },
        south: { type: Boolean}     // there's probably a cleaner way to do this
    },
    teamMembers: { type: String },
    createdDate: { type: Date, default: Date.now },
    completedDate: { type: Date },
    githubUrl: { type: String },
});

projectSchema.methods.serialize = function() {
    return {
        id: this._id,
        description: this.description,
        owner: this.owner,
        projectStatus: this.projectStatus,
        hackNights: {
            dtla: this.hackNights.dtla,
            westside: this.hackNights.westside,
            south: this.hackNights.south
        },
        teamMembers: this.teamMembers,
        createdDate: this.createdDate,
        completedDate: this.completedDate,
        githubUrl: this.githubUrl
    };
};

const Project = mongoose.model('Project', projectSchema);

module.exports = { Project };