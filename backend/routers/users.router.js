import express from 'express';
const router = express.Router();

import { UserController } from '../controllers/index.js';

// The base is /api/users
router.get('/', UserController.user_list);

router.post('/', UserController.create);

router.get('/:UserId', UserController.user_by_id);

router.patch('/:UserId', UserController.update);

router.delete('/:UserId', UserController.delete);

module.exports = router;
