const mongoose = require('mongoose');
const Location = require('./dictionaries/location.model');
const TimeZone = require('./dictionaries/timeZone.model');
const JobRole = require('./dictionaries/jobRole.model');

mongoose.Promise = global.Promise;

const TYPES = ['Software', 'Org-wide', 'Community of practice'];
const STATUSES = ['Active', 'Inactive'];

const projectInfoSchema = mongoose.Schema({
    name: { type: String }, // project name or team's title
    type: {type: String, enum : TYPES},
    description: { type: String, maxLength: 1000 },
    locationZone: {
        type: String,
        validate: 
        {
            validator(v) {

                if (v) {
                    Location.find({}, (err, docs) => {
                        if (err) {
                            return err;
                        } 
                        return docs[0].locations.indexOf(v) >= 0;
                    });
                }
                return false;

            },
            message: props => `${props.value} is not a valid phone number!`
        }  
      },
    timeZone: {
    type: String,
    validate: 
        { 
            validator(v) {
            
                if (v) {
                    Location.find({}, (err, docs) => {
                        if (err) {
                            return err;
                        } 
                        return docs[0].timeZones.indexOf(v) >= 0;
                    });
                }
                return false;

            }, 
            message: '{VALUE} is not a valid TimeZone'
        }
    },
    partner: { type: String }, 
    partnerUrl: { type: String }, 
    activeStatus: {type: String, enum : STATUSES},
    defaultConferenceUrl: { type: String }, 
    technologies: [{ type: String }],    
    languages: [{ type: String }],
    mainImage: Buffer,
    mainImageText: { type: String }, 
    backgroundImage: Buffer,
    backgroundImageText: { type: String }, 
    urls: {   // all fields are strings
        googleDrive: { type: String }, 	// project’s top-level Google Drive URL
        slack	: { type: String },	        // project’s main slack channel URL
        repository: { type: String },		// project’s GitHub URL
        readme	: { type: String },	// project’s GitHub Readme URL
        wiki	: { type: String },        	// project’s GitHub Wiki URL
        hflaPage: { type: String },		// project’s HfLA website dedicated page URL
        website		: { type: String },// project’s public independent website URL
        otherUrlLabel  : { type: String },  	// additional URL label
        otherUrlValue  : { type: String }, 	// additional URL value
    },
    seekingRoles: [{ type: String,
       
     }],		// roles project is currently recruiting for
    recruitingDetails: { type: String, maxLength: 1000 },    // additional recruiting details
    
    created: { type: Date, default: Date.now },  
    lastModified: { type: Date },  
    completed: { type: Date },  
    
});

projectInfoSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        type: this.type,
        description: this.description,
        locationZone: this.locationZone,
        timeZone: this.timeZone,
        partner: this.partner,
        partnerUrl: this.partnerUrl,
        activeStatus: this.activeStatus,
        defaultConferenceUrl: this.defaultConferenceUrl,
        technologies: this.technologies,
        languages: this.languages,
        mainImage: this.mainImage,
        mainImageText: this.mainImageText,
        backgroundImage: this.backgroundImage,
        backgroundImageText: this.backgroundImageText,
        ursl: this.urls,
        seekingRoles: this.seekingRoles,
        recruitingDetails: this.recruitingDetails,
        created: this.created,
        lastModified: this.lastModified,
        completed: this.completed
       
    };
};

const ProjectInfo = mongoose.model('ProjectInfo', projectInfoSchema);

module.exports = { ProjectInfo };
