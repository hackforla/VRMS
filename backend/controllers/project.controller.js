const { Project } = require('../models');

const ProjectController = {};

ProjectController.project_list = async function (req, res) {
  const { query } = req;

  try {
    const events = await Project.find(query);
    return res.json(events);
  } catch (err) {
    return res.sendStatus(500).json({
      message: `/GET Internal server error: ${err.stack}`,
    });
  }
};

ProjectController.create = async function (req, res) {
  const { body } = req;

  try {
    const newProject = await Project.create(body);
    return res.json(newProject);
  } catch (err) {
    return res.status(500).send({
      message: `/GET Internal server error: ${err}`,
    });
  }
};

ProjectController.project_by_id = function (req, res) {
  return res.send('NOT IMPLEMENTED: Read Project by id GET');
};

ProjectController.update = function (req, res) {
  return res.send('NOT IMPLEMENTED: Update Project by id PUT');
};

ProjectController.destroy = function (req, res) {
  return res.send('NOT IMPLEMENTED: Delete Project by id POST');
};

ProjectController.next_event = function (req, res) {
  return res.send('NOT IMPLEMENTED: Get next Project for Project GET');
};

ProjectController.project_member_list = function (req, res) {
  return res.send('NOT IMPLEMENTED: Get next Project for Project GET');
};


module.exports = ProjectController;