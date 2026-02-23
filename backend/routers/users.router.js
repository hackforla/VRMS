const express = require('express');
const router = express.Router();
const { Auth } = require('../middleware');
const { UserController } = require('../controllers');
const { ROLES } = require('../../shared/roles');

// The base is /api/users
router.get('/', UserController.user_list);

router.get('/id/:UserId', UserController.user_by_id);

router.get('/email/:email', UserController.user_by_email);

router.get('/admins', UserController.admin_list);

router.get('/projectManagers', UserController.projectManager_list);

router.post('/', UserController.create);

router.post('/bulk-updates', UserController.bulkUpdateManagedProjects);

router.patch(
  '/:UserId',
  [Auth.authUser, Auth.requireMinimumRole(ROLES.ADMIN)],
  UserController.update,
);

router.patch('/:UserId/managedProjects', UserController.updateManagedProjects);

router.delete(
  '/:UserId',
  [Auth.authUser, Auth.requireMinimumRole(ROLES.ADMIN)],
  UserController.delete,
);

module.exports = router;
