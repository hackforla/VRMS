const mongoose = require('mongoose');
// const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String }
    },
    email: { type: String },
    accessLevel: { type: String, default: "user" },
    createdDate: { type: Date, default: Date.now },
    checkInCount: { type: Number, default: 0 },
    questionsAnsweredCount: { type: Number, default: 0 }
    // password: { type: String, required: true }
});

userSchema.methods.serialize = () => {
    return {
        id: this._id,
        name: {
            firstName: this.name.firstName,
            lastName: this.name.lastName
        },
        email: this.email,
        accessLevel: this.accessLevel,
        createdDate: this.createdDate,
        checkInCount: this.checkInCount,
        questionsAnsweredCount: this.questionsAnsweredCount
    };
};



// userSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// userSchema.methods.validatePassword = function(password) {
//     return bcrypt.compareSync(password, this.password);
// };

const User = mongoose.model('User', userSchema);

module.exports = User;