import type { CookieOptions, Request, Response } from 'express';
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_PATH,
  REFRESH_TOKEN_TTL_MS,
} from '../config/authV2.config.ts';
import { User } from '../models/user.model.js';
import {
  hashPassword,
  issueRefreshToken,
  revokeRefreshToken,
  rotateRefreshToken,
  signAccessToken,
  verifyPassword,
} from '../services/authV2.service.ts';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-z0-9_.-]{3,30}$/i; // no "@", so it can't be mistaken for an email
const MIN_PASSWORD_LENGTH = 10;
const MAX_PASSWORD_BYTES = 72; // bcrypt ignores everything after 72 bytes
const ACCOUNT_EXISTS = 'An account with that email or username already exists';

interface PublicUser {
  id: string;
  email?: string;
  username?: string;
  name?: { firstName?: string; lastName?: string };
  accessLevel?: string;
}

function toPublicUser(user: any): PublicUser {
  return {
    id: String(user._id),
    email: user.email,
    username: user.username,
    name: { firstName: user.name?.firstName, lastName: user.name?.lastName },
    accessLevel: user.accessLevel,
  };
}

// The refresh token lives only in this cookie: JavaScript can't read it, and
// the browser sends it to /api/auth/v2/* and nowhere else.
function refreshCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: REFRESH_COOKIE_PATH,
  };
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    ...refreshCookieOptions(),
    maxAge: REFRESH_TOKEN_TTL_MS,
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions());
}

// Everything a client needs to hold a session: the access token goes in the
// body (kept in memory by the client), the refresh token goes in the cookie.
async function startSession(res: Response, user: any, family?: string) {
  const publicUser = toPublicUser(user);
  setRefreshCookie(res, await issueRefreshToken(publicUser.id, family));
  return {
    accessToken: signAccessToken(publicUser),
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    user: publicUser,
  };
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function signUp(req: Request, res: Response) {
  const email = text(req.body?.email).toLowerCase();
  const username = text(req.body?.username).toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!EMAIL_PATTERN.test(email))
    return res.status(400).json({ error: 'A valid email is required' });
  if (username && !USERNAME_PATTERN.test(username)) {
    return res.status(400).json({
      error: 'Username must be 3-30 letters, numbers, dots, dashes or underscores',
    });
  }
  if (password.length < MIN_PASSWORD_LENGTH || Buffer.byteLength(password) > MAX_PASSWORD_BYTES) {
    return res.status(400).json({
      error: `Password must be ${MIN_PASSWORD_LENGTH} to ${MAX_PASSWORD_BYTES} bytes long`,
    });
  }

  // Linking a password to someone who already has an account is a later
  // decision, so an email or username that exists in any form is refused.
  const taken = await User.findOne({ $or: username ? [{ email }, { username }] : [{ email }] });
  if (taken) return res.status(409).json({ error: ACCOUNT_EXISTS });

  const passwordHash = await hashPassword(password);
  const user = await User.create({
    email,
    username: username || undefined,
    name: { firstName: text(req.body?.firstName), lastName: text(req.body?.lastName) },
    passwordHash,
  }).catch((error: any) => (error?.code === 11000 ? null : Promise.reject(error)));
  // null: someone else registered the same email or username a moment ago.
  if (!user) return res.status(409).json({ error: ACCOUNT_EXISTS });

  return res.status(201).json(await startSession(res, user));
}

export async function signIn(req: Request, res: Response) {
  const identifier = text(req.body?.identifier).toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!identifier || !password) {
    return res
      .status(400)
      .json({ error: 'identifier (email or username) and password are required' });
  }

  const user = await User.findOne(
    identifier.includes('@') ? { email: identifier } : { username: identifier },
  ).select('+passwordHash');

  const passwordOk = await verifyPassword(password, user?.passwordHash);
  if (!user || !passwordOk || user.isActive === false) {
    // One message for every failure so the response doesn't reveal which accounts exist.
    return res.status(401).json({ error: 'Incorrect email/username or password' });
  }

  return res.json(await startSession(res, user));
}

export async function refresh(req: Request, res: Response) {
  const presented = req.cookies?.[REFRESH_COOKIE_NAME];
  if (typeof presented !== 'string' || !presented) {
    return res.status(401).json({ error: 'No refresh token' });
  }

  const rotation = await rotateRefreshToken(presented);
  if (rotation.status !== 'ok') {
    clearRefreshCookie(res);
    return res.status(401).json({
      error:
        rotation.status === 'reuse-detected'
          ? 'Refresh token was already used; the session has been ended'
          : 'Refresh token is invalid or expired',
    });
  }

  const user = await User.findById(rotation.userId);
  if (!user || user.isActive === false) {
    await revokeRefreshToken(rotation.token);
    clearRefreshCookie(res);
    return res.status(401).json({ error: 'Account is no longer available' });
  }

  const publicUser = toPublicUser(user);
  setRefreshCookie(res, rotation.token);
  return res.json({
    accessToken: signAccessToken(publicUser),
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    user: publicUser,
  });
}

export async function logout(req: Request, res: Response) {
  const presented = req.cookies?.[REFRESH_COOKIE_NAME];
  if (typeof presented === 'string' && presented) await revokeRefreshToken(presented);
  clearRefreshCookie(res);
  return res.sendStatus(204);
}

export async function me(_req: Request, res: Response) {
  const user = await User.findById(res.locals.authV2.sub);
  if (!user || user.isActive === false)
    return res.status(401).json({ error: 'Account is no longer available' });
  return res.json({ user: toPublicUser(user) });
}
