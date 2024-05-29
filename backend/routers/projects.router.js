const express = require("express");
const router = express.Router();

const { ProjectController } = require('../controllers');
const { AuthUtil } = require("../middleware");

// The base is /api/projects
router.get('/', ProjectController.project_list);

router.put('/', ProjectController.projects);

router.post('/', AuthUtil.verifyCookie, ProjectController.create);

router.get('/:ProjectId', ProjectController.project_by_id);

router.put('/:ProjectId', AuthUtil.verifyCookie, ProjectController.update);

router.patch('/:ProjectId', AuthUtil.verifyCookie, ProjectController.update);


module.exports = router;
