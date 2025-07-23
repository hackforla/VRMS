const { Project, User } = require('../models');

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

ProjectController.pm_filtered_projects = async function (req, res) {
  try {
    const projectList = await Project.find({});
    const projects = projectList.filter((proj) => req.body.includes(proj._id.toString()));
    return res.status(200).send(projects);
  } catch (e) {
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
    const project = await Project.findOneAndUpdate({ _id: ProjectId }, req.body, { new: true });
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

ProjectController.updateManagedByUsers = async function (req, res) {
  const { projectId } = req.params;
  const { action, userId } = req.body; // action - 'add' or 'remove'

  try {
    // Update project's managedByUsers and the user's managedProjects
    const project = await Project.findById(projectId);
    let managedByUsers = project.managedByUsers || [];

    const user = await User.findById(userId);
    let managedProjects = user.managedProjects || [];

    if (action === 'add') {
      managedByUsers = [...managedByUsers, userId];
      managedProjects = [...managedProjects, projectId];
    } else {
      // remove case
      managedByUsers = managedByUsers.filter((id) => id !== userId);
      managedProjects = managedProjects.filter((id) => id !== projectId);
    }

    // Update project's managedByUsers 
    project.managedByUsers = managedByUsers;
    await project.save({ validateBeforeSave: false });

    // Update user's managedProjects 
    user.managedProjects = managedProjects;
    await user.save({ validateBeforeSave: false });

    return res.status(200).send({ project, user });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

module.exports = ProjectController;
