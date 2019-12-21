const mongoose = require('mongoose');
// const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true }
    },
    email: { type: String },
    accessLevel: { type: String },
    createdDate: { type: Date, default: Date.now },
    checkInCount: { type: Number },
    questionsAnsweredCount: { type: Number }
    // password: { type: String, required: true }
});



// userSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// userSchema.methods.validatePassword = function(password) {
//     return bcrypt.compareSync(password, this.password);
// };

const User = mongoose.model('User', userSchema);

module.exports = User;