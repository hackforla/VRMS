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

const { User } = require('../models');

async function getProjectById(projectId) {
  if (projectId === '64077da036505ba8e73810b2') return null;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      console.warn(`Project not found for ID: ${projectId}`);
      return null; // Ensure it returns null if not found
    }
    return project;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null; // Return null on error to avoid breaking the app
  }
}

ProjectController.getProjectManagers = async function (req, res) {
  try {
    // const userProjectMap = {};
    const userProjectMap = [];
    const projectManagers = await User.find({
      $and: [
        { accessLevel: { $in: ['admin', 'superadmin'] } },
        { managedProjects: { $exists: true, $type: 'array', $ne: [] } },
      ],
    });

    for (const projectManager of projectManagers) {
      projectManager.accessLevel = 'projectLead';

      const projectNames = [];

      for (const projectId of projectManager.managedProjects) {
        // console.log('project', typeof project);
        const projectDetail = await getProjectById(projectId);
        if (projectDetail) {
          projectNames.push(projectDetail.name);
          // console.log('projectDetailName', projectDetail.name);
        } else {
          console.warn('Project detail is null, cannot access name');
        }
      }
      // console.log('projectNames', projectNames);
      projectManager.managedProjects = projectNames;
    }
    console.log('projectManager', projectManagers[0]);
    return res.status(200).send(projectManagers);
  } catch (err) {
    return res.sendStatus(400);
  }
};

module.exports = ProjectController;
