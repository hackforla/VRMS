import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_REUSE_GRACE_MS,
  REFRESH_TOKEN_TTL_MS,
  getAccessTokenSecret,
  getBcryptRounds,
} from '../config/authV2.config.ts';
import { RefreshTokenV2 } from '../models/refreshTokenV2.model.ts';

// ---------------------------------------------------------------- passwords

// Compared against when the account does not exist, so a wrong username and a
// wrong password take about the same time.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 4);

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, getBcryptRounds());
}

export function verifyPassword(
  password: string,
  hash: string | null | undefined,
): Promise<boolean> {
  return bcrypt.compare(password, hash || DUMMY_HASH).then((matches) => matches && Boolean(hash));
}

// ------------------------------------------------------------ access tokens

export interface AccessTokenClaims {
  sub: string;
  email?: string;
  accessLevel?: string;
}

export function signAccessToken(user: {
  id: string;
  email?: string;
  accessLevel?: string;
}): string {
  const secret = getAccessTokenSecret();
  if (!secret) throw new Error('Login v2 is not configured');
  const claims: AccessTokenClaims = {
    sub: user.id,
    email: user.email,
    accessLevel: user.accessLevel,
  };
  return jwt.sign(claims, secret, { algorithm: 'HS256', expiresIn: ACCESS_TOKEN_TTL_SECONDS });
}

export function verifyAccessToken(token: string): AccessTokenClaims | null {
  const secret = getAccessTokenSecret();
  if (!secret) return null;
  try {
    const claims = jwt.verify(token, secret, { algorithms: ['HS256'] });
    return typeof claims === 'object' && typeof claims.sub === 'string'
      ? (claims as unknown as AccessTokenClaims)
      : null;
  } catch {
    return null;
  }
}

// ----------------------------------------------------------- refresh tokens

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Creates a refresh token. A new sign-in starts a new family; a rotation keeps
// the family of the token it replaces.
export async function issueRefreshToken(userId: string, family: string = crypto.randomUUID()) {
  const token = crypto.randomBytes(32).toString('base64url');
  await RefreshTokenV2.create({
    userId,
    family,
    hash: hashToken(token),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  });
  return token;
}

export type RotationResult =
  | { status: 'ok'; userId: string; token: string }
  | { status: 'invalid' }
  | { status: 'superseded' }
  | { status: 'reuse-detected' };

// Exchanges a refresh token for a new one. The old token is marked used in one
// atomic update, so it can only ever be exchanged once.
export async function rotateRefreshToken(rawToken: string): Promise<RotationResult> {
  const hash = hashToken(rawToken);
  const now = new Date();

  const used = await RefreshTokenV2.findOneAndUpdate(
    { hash, usedAt: null, expiresAt: { $gt: now } },
    { usedAt: now },
  );

  if (used) {
    const token = await issueRefreshToken(String(used.userId), used.family);
    return { status: 'ok', userId: String(used.userId), token };
  }

  // Not exchangeable. If it was already used, someone is replaying it.
  const replayed = await RefreshTokenV2.findOne({ hash, usedAt: { $ne: null } });
  if (!replayed?.usedAt) return { status: 'invalid' };
  if (now.getTime() - replayed.usedAt.getTime() <= REFRESH_REUSE_GRACE_MS) {
    return { status: 'superseded' }; // recent: most likely a second tab, leave the session alone
  }
  await RefreshTokenV2.deleteMany({ family: replayed.family });
  return { status: 'reuse-detected' };
}

// Ends the whole sign-in (every token in the family) that this token belongs to.
export async function revokeRefreshToken(rawToken: string): Promise<void> {
  const token = await RefreshTokenV2.findOne({ hash: hashToken(rawToken) });
  if (token) await RefreshTokenV2.deleteMany({ family: token.family });
}
