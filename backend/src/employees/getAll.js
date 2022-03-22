const { EmployeeService } = require('./services/employee.service');

const getAll = async (_, res, next) => {
  await EmployeeService.all()
    .then((locations) => res.status(200).json(locations))
    .catch(next);
};

module.exports = {
  getAll,
};
