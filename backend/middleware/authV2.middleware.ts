import type { NextFunction, Request, Response } from 'express';
import {
  SIGNIN_LIMIT_WINDOW_MS,
  getSigninLimit,
  isAuthV2Configured,
} from '../config/authV2.config.ts';
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

// Counts failed sign-in and sign-up attempts per client IP in a fixed window,
// so passwords can't be guessed without limit while many people signing in
// from one network are never blocked. Each attempt holds a slot while it runs,
// so a burst of parallel guesses can't all slip past the check; the slot is
// given back if the attempt succeeds. Counts are kept in memory only.
let windowStartedAt = Date.now();
const attemptsByIp = new Map<string, number>();

export function limitSigninAttempts(req: Request, res: Response, next: NextFunction) {
  const now = Date.now();
  if (now - windowStartedAt >= SIGNIN_LIMIT_WINDOW_MS) {
    windowStartedAt = now;
    attemptsByIp.clear();
  }
  const key = req.ip ?? 'unknown';
  const attempts = attemptsByIp.get(key) ?? 0;
  if (attempts >= getSigninLimit()) {
    res.set('Retry-After', String(Math.ceil((windowStartedAt + SIGNIN_LIMIT_WINDOW_MS - now) / 1000)));
    return res.status(429).json({ error: 'Too many failed sign-in attempts; try again later' });
  }
  attemptsByIp.set(key, attempts + 1);
  const window = windowStartedAt;
  res.on('finish', () => {
    if (res.statusCode < 200 || res.statusCode >= 300 || window !== windowStartedAt) return;
    attemptsByIp.set(key, (attemptsByIp.get(key) ?? 1) - 1);
  });
  next();
}
