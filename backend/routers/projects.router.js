const express = require("express");
const router = express.Router();

const { ProjectController } = require('../controllers');
const { AuthUtil } = require("../middleware");

// The base is /api/projects

router.get('/projectManagers', ProjectController.getProjectManagers);

router.get('/', ProjectController.project_list);

// Its a put because we have to send the PM projects to be filtered here
router.put('/', ProjectController.pm_filtered_projects);

router.post('/', AuthUtil.verifyCookie, ProjectController.create);

router.get('/:ProjectId', ProjectController.project_by_id);

router.put('/:ProjectId', AuthUtil.verifyCookie, ProjectController.update);

router.patch('/:ProjectId', AuthUtil.verifyCookie, ProjectController.update);


module.exports = router;
