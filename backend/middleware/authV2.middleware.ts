import { toNodeHandler } from 'better-auth/node';
import type { NextFunction, Request, Response } from 'express';
import { CLIENT_IP_HEADER, isAuthV2Configured } from '../config/authV2.config.ts';
import { getAuth } from '../services/authV2.service.ts';

// Hands every /api/auth/v2/* request to Better Auth. It reads the raw request
// itself, so this must be mounted before express.json() and with app.all(...),
// not app.use(...), so that the full path reaches the library.
export function authV2Handler(req: Request, res: Response, next: NextFunction) {
  // Login v2 is optional: until it is configured, say so plainly instead of
  // failing in some less obvious way.
  if (!isAuthV2Configured()) {
    return res.status(503).json({ error: 'Login v2 is not configured on this server' });
  }
  const auth = getAuth();
  if (!auth) {
    return res.status(503).json({ error: 'Login v2 is not ready yet' });
  }
  // Rate limiting keys on this header; set it from Express's own view of the
  // client (which honors `trust proxy`) so a caller cannot choose their own.
  req.headers[CLIENT_IP_HEADER] = req.ip ?? '';
  toNodeHandler(auth)(req, res).catch(next);
}
