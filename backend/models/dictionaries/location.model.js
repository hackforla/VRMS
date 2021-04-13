const mongoose = require('mongoose');
const DatabaseError = require('../../errors/database.error');

mongoose.Promise = global.Promise;

const locationSchema = mongoose.Schema({

    locations: {
        type: [{
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                  return v.trim().length > 0;
                },
                message: props => `An empty string is not allowed`
            }
        }],
        required: true
    } 
});




locationSchema.methods.serialize = function() {
    return {
        locations: this.locations
    };
};


const Location = mongoose.model('Location', locationSchema);

module.exports = { Location };
