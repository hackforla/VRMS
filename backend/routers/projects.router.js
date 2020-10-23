const express = require("express");
const router = express.Router();

const { Project } = require('../models/project.model');

const { ProjectController } = require('../controllers');

// Display list of all Projects with GET.
router.get('/', ProjectController.project_list);

// Create new Project with POST.
router.post('/', ProjectController.create);

// Display Project by id with GET.
router.get('/:ProjectId', ProjectController.project_by_id);

// Update Project by id with PATCH.
router.patch('/:ProjectId', ProjectController.update_project);

// Delete Project by id with POST.
router.delete('/:ProjectId', ProjectController.destroy);

// // Display list of Project Event with GET.
// router.get('/:ProjectId/upcomingevents', ProjectController.event_list);

// // Get Project members list by GET
// router.get('/:ProjectId/members', ProjectController.member_list);


module.exports = router;
