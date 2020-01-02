const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const eventSchema = mongoose.Schema({
    name: { type: String },
    location: {
        city: { type: String },
        state: { type: String },
        country: { type: String }
    },
    hacknight: { type: String },
    date: { type: Date },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    checkInCount: { type: Number, default: 0 },
    checkInReady: { type: Boolean, default: false },
    owner: {
        ownerId: { type: Number }
    }
});

eventSchema.methods.serialize = () => {
    return {
        id: this._id,
        location: {
            city: this.location.city,
            state: this.location.state,
            country: this.location.country
        },
        hacknight: this.hacknight,
        date: this.date,
        createdDate: this.createdDate,
        checkInCount: this.checkInCount,
        checkInReady: this.checkInReady,
        owner: {
            ownerId: this.owner.ownerId
        }
    };
};

const Event = mongoose.model('Event', eventSchema);

module.exports = { Event };



