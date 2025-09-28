const express = require('express');
const router = express.Router();

const { ProjectController } = require('../controllers');
const { AuthUtil } = require('../middleware');

// The base is /api/projects
router.get('/', ProjectController.project_list);

// Its a put because we have to send the PM projects to be filtered here
router.put('/', ProjectController.pm_filtered_projects);

router.post('/', AuthUtil.verifyCookie, ProjectController.create);

router.get('/:ProjectId', AuthUtil.verifyCookie, ProjectController.project_by_id);

router.put('/:ProjectId', AuthUtil.verifyCookie, ProjectController.update);

// Update project's managedByUsers in db
router.patch('/:ProjectId', AuthUtil.verifyCookie, ProjectController.updateManagedByUsers);

// Bulk update for editing project members
router.post('/bulk-updates', AuthUtil.verifyCookie, ProjectController.bulkUpdateManagedByUsers);

module.exports = router;
