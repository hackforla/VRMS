const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const locationSchema = mongoose.Schema({

    locations: [String] 
});




locationSchema.methods.serialize = function() {
    return {
        locations: this.locations
    };
};


const Location = mongoose.model('Location', locationSchema);

module.exports = { Location };
