const { Project } = require('../models');

const ProjectController = {};

ProjectController.project_list = async function (req, res) {
  const { query } = req;

  try {
    const projects = await Project.find(query);
    return res.status(200).send(projects);
  } catch (err) {
    return res.sendStatus(400);
  }
};

ProjectController.create = async function (req, res) {
  const { body } = req;

  try {
    const newProject = await Project.create(body);
    return res.status(201).send(newProject);
  } catch (err) {
    return res.sendStatus(400);
  }
};

ProjectController.project_by_id = async function (req, res) {
  const { ProjectId } = req.params;

  try {
    const project = await Project.findById(ProjectId);
    return res.status(200).send(project);
  } catch (err) {
    return res.sendStatus(400);
  }
};

ProjectController.update = async function (req, res) {
  const { ProjectId } = req.params;

  try {
    const project = await Project.findOneAndUpdate(ProjectId, req.body);
    return res.status(200).send(project);
  } catch (err) {
    return res.sendStatus(400);
  }
};

ProjectController.destroy = async function (req, res) {
  const { ProjectId } = req.params;

  try {
    const project = await Project.findByIdAndDelete(ProjectId);
    return res.status(200).send(project);
  } catch (err) {
    return res.sendStatus(400);
  }
};

ProjectController.next_event = function (req, res) {
  return res.sendStatus('NOT IMPLEMENTED: Get next Project for Project GET');
};

ProjectController.project_member_list = function (req, res) {
  return res.sendStatus('NOT IMPLEMENTED: Get next Project for Project GET');
};


module.exports = ProjectController;