/* eslint-disable func-names */
const Employee = require('../models/employee');
const DatabaseError = require("../../errors/database.error");

const EmployeeService = {};

EmployeeService.all = async function () {
  try {
    const result = await Employee.find();
    return result;
  } catch (error) {
    throw new DatabaseError(error.message);
  }
};

EmployeeService.getByName = async function (name) {
  try {
    const result = await UserProfile.find({ name });
    return result;
  } catch (error) {
    throw new DatabaseError(error.message);
  }
};

module.exports.EmployeeService = EmployeeService;
