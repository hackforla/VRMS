const mongoose = require('mongoose');
const recurIntervalEnums = ['daily','weekly','bi-weekly','monthly'];  // daily, weekly, bi-weekly, monthly 
const monthWeekEnums = [1,2,3,4,5];                                   // 1st week, 2nd week, 3rd week, 4th week, 5th week - a month can have either 4 weeks or 5 weeks
const weekDayEnums = [0, 1, 2, 3, 4, 5, 6];                           // sunday,monday,tuesday, wednesday,thrursday,fridaya,saturdaya
mongoose.Promise = global.Promise;

const eventTemplateSchema = mongoose.Schema({
    name: { type: String },
    belongsToProjectID:{type:String}, // Ative project an event is a child of, if any (structured)
    eventManagerID:{type:String},     // ID of user that is responsible for managing event
    locationZone: { type: mongoose.Schema.Types.ObjectId,  ref: 'TimeZone'  },                                // HfLA locations project participates at (predefined in dictionary)
    locationName:{ type: String },    // Name of event location
    description: { type: String },
    type: {type: String, enum : ['Project Meeting', 'Orientation', 'Workshop', 'Hacknight']},
    createdDate: { type: Date, default: Date.now },
    startTime: { type: Date },                          
    endTime: { type: Date },
    timeZone: {type: String},         // Event’s time zone    
    templateID: {type: String},       // Event’s join ID connecting it to recurring instances for future editing
    recurInterval: {type: String, enum : recurIntervalEnums},
    weekDay: {type: Number, enum : weekDayEnums}, //day of the week for the meetings
    monthWeek: {type: Number, enum : monthWeekEnums},
    isActive: { type: Boolean},
    project: {  type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
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



