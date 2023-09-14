const express = require("express");
const router = express.Router();
const { AuthUtil } = require('../middleware')

const { ProjectController } = require('../controllers');

// The base is /api/projects
router.get('/', ProjectController.project_list);

router.post('/', AuthUtil.protect, ProjectController.create);

router.get('/:ProjectId', ProjectController.project_by_id);

router.put('/:ProjectId', ProjectController.update);

router.patch('/:ProjectId', ProjectController.update);


module.exports = router;
