const { Project } = require('../models');

async function getAllBooks() {
  try {
    const projects = await Project.findOne({}).exec();
    return projects;
  } catch (err) {
    return err.stack;
  }
}

module.exports = {
  getAllBooks,
};
