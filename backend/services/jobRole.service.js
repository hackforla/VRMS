
const DatabaseError = require('../errors/database.error');
const { JobRole } = require('../models/dictionaries/jobRole.model');

const getAll = async () => {
  try {
    const document = await JobRole.findOne({}); 
    return document.roles;
  }
  catch (error) {
    throw new DatabaseError(error);
  }
}

export const JobRoleService = {
  getAll
}
