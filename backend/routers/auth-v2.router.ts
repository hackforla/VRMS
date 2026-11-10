import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import * as controller from '../controllers/authV2.controller.ts';
import { requireAccessTokenV2, requireAuthV2Configured } from '../middleware/authV2.middleware.ts';

// Login v2, mounted at /api/auth/v2. Not connected to the current login flow.
const router = express.Router();

// Express 4 doesn't catch rejected promises, so hand them to the error handler.
const route =
  (handler: (req: Request, res: Response) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    handler(req, res).catch(next);
  };

router.use(requireAuthV2Configured);

router.post('/signup', route(controller.signUp));
router.post('/signin', route(controller.signIn));
router.post('/refresh', route(controller.refresh));
router.post('/logout', route(controller.logout));
router.get('/me', requireAccessTokenV2, route(controller.me));

export default router;
