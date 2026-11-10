import type { NextFunction, Request, Response } from 'express';
import { isAuthV2Configured } from '../config/authV2.config.ts';
import { type AccessTokenClaims, verifyAccessToken } from '../services/authV2.service.ts';

// Login v2 is optional: until its secret is set, every v2 route says so
// instead of failing in some less obvious way.
export function requireAuthV2Configured(_req: Request, res: Response, next: NextFunction) {
  if (!isAuthV2Configured()) {
    return res.status(503).json({
      error: 'Login v2 is not configured',
      detail: 'Set AUTH_V2_ACCESS_TOKEN_SECRET (at least 32 characters) on the backend.',
    });
  }
  next();
}

// Expects `Authorization: Bearer <access token>`; the verified claims are left
// on res.locals.authV2.
export function requireAccessTokenV2(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;
  const claims = token ? verifyAccessToken(token) : null;
  if (!claims) {
    return res.status(401).json({ error: 'Access token missing, invalid or expired' });
  }
  res.locals.authV2 = claims satisfies AccessTokenClaims;
  next();
}
