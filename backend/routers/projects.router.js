const express = require("express");
const router = express.Router();

const { ProjectController } = require('../controllers');
const { verifyUser } = require('../middleware');

// Display list of all Projects with GET.
router.get('/', ProjectController.project_list);

// Create new Project with POST.
router.post('/', ProjectController.create);

// Display Project by id with GET.
router.get('/:ProjectId', ProjectController.project_by_id);

// Update Project by id with PATCH.
router.patch('/:ProjectId', ProjectController.update);

// Delete Project by id with POST.
router.delete('/:ProjectId', ProjectController.destroy);

// Display list of Project Event with GET.
router.get('/:ProjectId/upcomingevents', ProjectController.event_list);


module.exports = router;
