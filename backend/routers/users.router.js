import express from 'express';
const router = express.Router();

import { Auth } from '../middleware/index.js';
import { UserController } from '../controllers/index.js';
import { ROLES } from '../../shared/roles.js';

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

export default router;
