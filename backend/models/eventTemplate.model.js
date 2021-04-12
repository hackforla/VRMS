const { Location } = require('./dictionaries/location.model');
const { TimeZone } = require('./dictionaries/timeZone.model');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const eventTemplateSchema = mongoose.Schema({
  name: { type: String },
  belongsToProjectID: { type: mongoose.Schema.Types.ObjectId }, // Active project an event is a child of, if any (structured)
  eventManagerID: { type: mongoose.Schema.Types.ObjectId}, // ID of user that is responsible for managing event
  locationZone: {
    type: String,
    validate: {
      validator: async function (v) {
        let loc = await Location.find({});
        return loc[0].locations.indexOf(v) >= 0;
      },
      message: (props) => `${props.value} is not a valid location`,
    },
  }, // HfLA locations project participates at (predefined in dictionary)
  locationName: { type: String }, // Name of event location
  description: { type: String },
  type: { type: String, enum: ['Project Meeting', 'Orientation', 'Workshop', 'Hacknight'] },
  createdDate: { type: Date, default: Date.now },
  startTime: { type: Date },
  endTime: { type: Date },
  timeZone: {
    type: String,
    validate: {
      validator: async function (v) {
        let timeZone = await TimeZone.find({});
        return timeZone[0].timeZones.indexOf(v) >= 0;
      },
      message: '{VALUE} is not a valid TimeZone',
    },
  }, // Event’s time zone
  templateID: { type: String }, // Event’s join ID connecting it to recurring instances for future editing
  recurInterval: { type: String, enum: ['daily', 'weekly', 'bi-weekly', 'monthly'] }, // daily, weekly, bi-weekly, monthly
  weekDay: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6] }, //day of the week for the meetings -? sunday, monday, tuesday, wednesday,thrursday, friday, saturday
  monthWeek: { type: Number, enum: [1, 2, 3, 4, 5] }, // 1st week, 2nd week, 3rd week, 4th week, 5th week - a month can have either 4 weeks or 5 weeks
  isActive: { type: Boolean },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  isOnline: { type: Boolean },
  location: {
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
  },
  videoConferenceLink: { type: String },
});

eventTemplateSchema.methods.serialize = function () {
  return {
    id: this._id,
    name: this.name,

    belongsToProjectID: this.belongsToProjectID,
    eventManagerID: this.eventManagerID,
    locationZone: this.locationZone,
    locationName: this.locationName,
    timeZone: this.timeZone,
    templateID: this.templateID,
    recurInterval: this.recurInterval,
    monthWeek: this.monthWeek,

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
      zip: this.location.zip,
    },
    videoConferenceLink: this.videoConferenceLink,
  };
};

const EventTemplate = mongoose.model('EventTemplate', eventTemplateSchema);

module.exports = EventTemplate;
