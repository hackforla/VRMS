const { Project } = require('../models');
const { DatabaseError } = require('../models');

const getProjects = async () => {
  try {
    return await Project.find({});
  } catch (error) {
    throw new DatabaseError(error);
  }
};

module.exports.ProjectsService = {
  getProjects,
};
