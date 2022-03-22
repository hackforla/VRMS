const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

/* This is a temp model - used for testing local MongoDB and data generation scripts. */
/* {
    "name":"Marcus Hirthe",
    "title":"Senior Functionality Designer",
    "department":"Operations Management",
    "joined":"2020-12-19T14:06:29.007Z"
   } */

const employeeSchema = mongoose.Schema({
  name: { type: String },
  title: { type: String },
  department: { type: String },
  joined: { type: Date },
});

employeeSchema.methods.serialize = function () {
  return {
    id: this._id,
    name: this.name,
    title: this.title,
    department: this.department,
    joined: this.joined,
  };
};

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
