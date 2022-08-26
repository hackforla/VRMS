const { ProjectsController } = require('../controllers');

const express = require('express');
const router = express.Router();

// The root is /api/projects
router.get('/', ProjectsController.getProjects);

module.exports = router;
