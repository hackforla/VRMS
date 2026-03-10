const express = require('express');
const router = express.Router();

const { ProjectController } = require('../controllers');
// const { Auth } = require('../middleware');
// const { ROLES } = require('../../shared/roles');

// Require user to be project manager or higher (commented out for now for current app to work succesfully without auth, will re-enable when auth is ready)
// router.use(Auth.authUser, Auth.requireMinimumRole(ROLES.PROJECT_MANAGER));
// The base is /api/projects
router.get('/', ProjectController.project_list);

// Its a put because we have to send the PM projects to be filtered here
router.put('/', ProjectController.pm_filtered_projects);

router.post('/', ProjectController.create);

router.get('/:ProjectId', ProjectController.project_by_id);

router.put('/:ProjectId', ProjectController.update);

// Update project's managedByUsers in db
router.patch('/:ProjectId', ProjectController.updateManagedByUsers);

// Bulk update for editing project members
router.post('/bulk-updates', ProjectController.bulkUpdateManagedByUsers);

module.exports = router;
