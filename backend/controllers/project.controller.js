const { Project } = require('../models');

const ProjectController = {};

ProjectController.project_list = function (req, res) {
  res.send('NOT IMPLEMENTED: List Projects GET');
};

ProjectController.create = function (req, res) {
  res.send('NOT IMPLEMENTED: Create Project list GET');
};

ProjectController.project_by_id = function (req, res) {
  res.send('NOT IMPLEMENTED: Read Project by id GET');
};

ProjectController.update = function (req, res) {
  res.send('NOT IMPLEMENTED: Update Project by id PUT');
};

ProjectController.delete = function (req, res) {
  res.send('NOT IMPLEMENTED: Delete Project by id POST');
};

ProjectController.next_event = function (req, res) {
  res.send('NOT IMPLEMENTED: Get next Project for Project GET');
};

ProjectController.next_event_list = function (req, res) {
  res.send('NOT IMPLEMENTED: Get next Project for Project GET');
};


module.exports = ProjectController;
