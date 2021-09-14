const faker = require("faker");
const { ObjectID } = require("mongodb");

const generateEmployees = (amount) => {
  let employees = [];
  for (x = 0; x < amount; x++) {
    employees.push(createEmployee());
  }
  return employees;
};
const createEmployee = () => {
  const companyDepartments = [
    "Marketing",
    "Finance",
    "Operations Management",
    "Human Resources",
    "IT",
  ];
  const employeeDepartment = companyDepartments[Math.floor(Math.random() * companyDepartments.length)];
  const employee = {
    "_id": {"$oid":new ObjectID()},
    name: faker.name.findName(),
    title: faker.name.jobTitle(),
    department: employeeDepartment,
    joined: faker.date.past(),
  };
  
  return employee;
};

module.exports = {
  generateEmployees,
};