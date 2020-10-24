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

// TODO: Implement Get Project members list with GET
router.get('/:ProjectId/members', [verifyUser.isAdminByEmail], ProjectController.member_list);

// TODO: Implement Add a Project members with POST
router.post('/:ProjectId/members', [verifyUser.isAdminByEmail], ProjectController.add_member);

// TODO: Implement Get a Project member with GET
router.get('/:ProjectId/members/:MemberId', [verifyUser.isAdminByEmail], ProjectController.member_by_id);

// TODO: Implement Remove a Project member with POST
router.delete('/:ProjectId/members/:MemberId', [verifyUser.isAdminByEmail], ProjectController.remove_member);


module.exports = router;
