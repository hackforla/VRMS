const { ProjectsService } = require('../services');
const ProjectsController = {};

ProjectsController.getProjects = async (req, res, next) => {
  try {
    const projects = await ProjectsService.getProjects();
    return res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

module.exports = ProjectsController;
