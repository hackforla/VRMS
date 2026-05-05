import { Project, User } from '../models/index.js';
import { ObjectId } from 'mongodb';

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
  const { ProjectId } = req.params;
  const { action, userId } = req.body; // action - 'add' or 'remove'

  try {
    // Update project's managedByUsers and the user's managedProjects
    const project = await Project.findById(ProjectId);
    let managedByUsers = project.managedByUsers || [];

    const user = await User.findById(userId);
    let managedProjects = user.managedProjects || [];

    if (action === 'add') {
      managedByUsers = [...new Set([...managedByUsers, userId])];
      managedProjects = [...new Set([...managedProjects, ProjectId])];
    } else {
      // remove case
      managedByUsers = managedByUsers.filter((id) => id !== userId);
      managedProjects = managedProjects.filter((id) => id !== ProjectId);
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

ProjectController.bulkUpdateManagedByUsers = async function (req, res) {
  const { bulkOps } = req.body;

  // Convert string IDs to ObjectId in bulkOps
  bulkOps.forEach((op) => {
    if (op?.updateOne?.filter._id) {
      op.updateOne.filter._id = new ObjectId(op.updateOne.filter._id);
    }
    if (op?.updateOne?.update) {
      const update = op.updateOne.update;
      if (update?.$addToSet?.managedByUsers) {
        update.$addToSet.managedByUsers = new ObjectId(update.$addToSet.managedByUsers);
      }
      if (update?.$pull?.managedByUsers) {
        update.$pull.managedByUsers = new ObjectId(update.$pull.managedByUsers);
      }
    }
  });

  try {
    const result = await Project.bulkWrite(bulkOps);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update onboard/offboard visibility for a project
ProjectController.updateOnboardOffboardVisibility = async function (req, res) {
  const { ProjectId } = req.params;
  const { onboardOffboardVisible } = req.body;

  try {
    const project = await Project.findByIdAndUpdate(
      ProjectId,
      { onboardOffboardVisible },
      { new: true }
    );

    if (!project) {
      return res.status(404).send({ message: 'Project not found' });
    }

    return res.status(200).send(project);
  } catch (err) {
    return res.status(400).send({ message: 'Error updating visibility', error: err.message });
  }
};

export default ProjectController;
