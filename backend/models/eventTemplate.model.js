const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const eventTemplateSchema = mongoose.Schema({
    name: { type: String },
    description: { type: String },
    type: {type: String, enum : ['Project Meeting', 'Orientation', 'Workshop', 'Hacknight']},
    createdDate: { type: Date, default: Date.now },
    weekDay: {type: Number, enum : [0, 1, 2, 3, 4, 5, 6]},
    startTime: { type: Date },                          
    endTime: { type: Date },                            
    isActive: { type: Boolean},
    project: {                                          
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    isOnline: { type: Boolean},
    location: {                                         
        addressLine1: { type: String },
        addressLine2: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String }
    },
    videoConferenceLink: { type: String }              
});

eventTemplateSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        description: this.description,
        type: this.type,
        createdDate: this.createdDate,
        weekDay: this.weekDay,
        startTime: this.startTime,
        endTime: this.endTime,
        isActive: this.isActive,
        project: this.project,
        isOnline: this.isOnline,
        location: {
            addressLine1: this.location.addressLine1,
            addressLine2: this.location.addressLine2,
            city: this.location.city,
            state: this.location.state,
            zip: this.location.zip
        },
        videoConferenceLink: this.videoConferenceLink
    };
};

const EventTemplate = mongoose.model('EventTemplate', eventTemplateSchema);

module.exports = EventTemplate;



