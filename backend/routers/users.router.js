const express = require('express');
const router = express.Router();

const { UserController } = require('../controllers');

// Get list of Users with GET
router.get('/', UserController.user_list);

// Create User with POST
router.post('/', UserController.create);

// Get User by id with GET
router.get('/:UserId', UserController.user_by_id);

// Update User with PATCH
router.patch('/:UserId', UserController.update);

// Delete User with DELETE
router.delete('/:UserId', UserController.delete);

module.exports = router;
