const express = require('express');
const router = express.Router();

const { UserController } = require('../controllers');

// The base is /api/users
router.get('/', UserController.user_list);

router.get('/admins', UserController.admin_list);

router.post('/', UserController.create);

router.get('/:UserId', UserController.user_by_id);

router.patch('/:UserId', UserController.update);

router.delete('/:UserId', UserController.delete);

module.exports = router;
