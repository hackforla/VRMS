import express from 'express';
const router = express.Router();

import { ProjectController } from '../controllers/index.js';

// The base is /api/projects
router.get('/', ProjectController.project_list);

router.post('/', ProjectController.create);

router.get('/:ProjectId', ProjectController.project_by_id);

router.patch('/:ProjectId', ProjectController.update);


module.exports = router;
