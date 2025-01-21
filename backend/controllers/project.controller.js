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

ProjectController.pm_filtered_projects = async function(req, res) {
  try {
    const projectList = await Project.find({})
    const projects = projectList.filter(proj => req.body.includes(proj._id.toString()))
    return res.status(200).send(projects)
  } catch(e) {
    return res.sendStatus(400)
  }
}

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
    const project = await Project.findOneAndUpdate({_id: ProjectId}, req.body, {new: true});
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


ProjectController.getProjectManagers = async function (req, res) {
  try {
    const userProjectMap = {};
    const projects = await Project.find({
      managedByUsers: { $exists: true, $ne: [] }
    });

    for (const project of projects) {
      for (const user of project.managedByUsers) {
        if (!userProjectMap[user]) {
          userProjectMap[user] = [];
        }
        userProjectMap[user].push(project.name);
      }
    }
    return res.status(200).send(userProjectMap);
  } catch (err) {
    return res.sendStatus(400);
  }
};


module.exports = ProjectController;
