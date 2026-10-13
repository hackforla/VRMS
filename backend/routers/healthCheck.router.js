import express from 'express';
const router = express.Router();

import { HealthCheckController } from '../controllers/index.js';

// The root is /api/healthcheck
router.get('/', HealthCheckController.isAlive);

export default router;
