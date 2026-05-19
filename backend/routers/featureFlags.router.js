import express from 'express';
const router = express.Router();

import { FeatureFlagsController } from '../controllers/index.js';
import { Auth } from '../middleware/index.js';

router.get('/', Auth.addCookieIfAvailable, FeatureFlagsController.index);

export default router;
